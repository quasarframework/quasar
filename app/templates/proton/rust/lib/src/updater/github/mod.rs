use std::path::PathBuf;
use std::fs;
use std::env;

use super::super::version;
use super::super::http;
use super::super::file::{Move, Extract};

mod release;
pub use release::*;
mod error;
pub use self::error::Error;
use super::*;

/// `github::Update` builder
///
/// Configure download and installation from
/// `https://api.github.com/repos/<repo_owner>/<repo_name>/releases/latest`
#[derive(Debug)]
pub struct UpdateBuilder {
    repo_owner: Option<String>,
    repo_name: Option<String>,
    target: Option<String>,
    bin_name: Option<String>,
    bin_install_path: Option<PathBuf>,
    bin_path_in_archive: Option<PathBuf>,
    show_download_progress: bool,
    show_output: bool,
    no_confirm: bool,
    current_version: Option<String>,
    target_version: Option<String>,
}
impl UpdateBuilder {
    /// Initialize a new builder, defaulting the `bin_install_path` to the current
    /// executable's path
    ///
    /// * Errors:
    ///     * Io - Determining current exe path
    pub fn new() -> Result<Self, Error> {
        Ok(Self {
            repo_owner: None,
            repo_name: None,
            target: None,
            bin_name: None,
            bin_install_path: Some(env::current_exe()?),
            bin_path_in_archive: None,
            show_download_progress: false,
            show_output: true,
            no_confirm: false,
            current_version: None,
            target_version: None,
        })
    }

    /// Set the repo owner, used to build a github api url
    pub fn repo_owner(&mut self, owner: &str) -> &mut Self {
        self.repo_owner = Some(owner.to_owned());
        self
    }

    /// Set the repo name, used to build a github api url
    pub fn repo_name(&mut self, name: &str) -> &mut Self {
        self.repo_name = Some(name.to_owned());
        self
    }

    /// Set the current app version, used to compare against the latest available version.
    /// The `cargo_crate_version!` macro can be used to pull the version from your `Cargo.toml`
    pub fn current_version(&mut self, ver: &str) -> &mut Self {
        self.current_version = Some(ver.to_owned());
        self
    }

    /// Set the target version tag to update to. This will be used to search for a release
    /// by tag name:
    /// `/repos/:owner/:repo/releases/tags/:tag`
    ///
    /// If not specified, the latest available release is used.
    pub fn target_version_tag(&mut self, ver: &str) -> &mut Self {
        self.target_version = Some(ver.to_owned());
        self
    }

    /// Set the target triple that will be downloaded, e.g. `x86_64-unknown-linux-gnu`.
    /// The `get_target` function can cover use cases for most mainstream arches
    pub fn target(&mut self, target: &str) -> &mut Self {
        self.target = Some(target.to_owned());
        self
    }

    /// Set the exe's name. Also sets `bin_path_in_archive` if it hasn't already been set.
    pub fn bin_name(&mut self, name: &str) -> &mut Self {
        self.bin_name = Some(name.to_owned());
        if self.bin_path_in_archive.is_none() {
            self.bin_path_in_archive = Some(PathBuf::from(name));
        }
        self
    }

    /// Set the installation path for the new exe, defaults to the current
    /// executable's path
    pub fn bin_install_path(&mut self, bin_install_path: &str) -> &mut Self {
        self.bin_install_path = Some(PathBuf::from(bin_install_path));
        self
    }

    /// Set the path of the exe inside the release tarball. This is the location
    /// of the executable relative to the base of the tar'd directory and is the
    /// path that will be copied to the `bin_install_path`. If not specified, this
    /// will default to the value of `bin_name`. This only needs to be specified if
    /// the path to the binary (from the root of the tarball) is not equal to just
    /// the `bin_name`.
    ///
    /// # Example
    ///
    /// For a tarball `myapp.tar.gz` with the contents:
    ///
    /// ```shell
    /// myapp.tar/
    ///  |------- bin/
    ///  |         |--- myapp  # <-- executable
    /// ```
    ///
    /// The path provided should be:
    ///
    /// ```
    /// # use self_update::backends::github::Update;
    /// # fn run() -> Result<(), Box<::std::error::Error>> {
    /// Update::configure()?
    ///     .bin_path_in_archive("bin/myapp")
    /// #   .build()?;
    /// # Ok(())
    /// # }
    /// ```
    pub fn bin_path_in_archive(&mut self, bin_path: &str) -> &mut Self {
        self.bin_path_in_archive = Some(PathBuf::from(bin_path));
        self
    }

    /// Toggle download progress bar, defaults to `off`.
    pub fn show_download_progress(&mut self, show: bool) -> &mut Self {
        self.show_download_progress = show;
        self
    }

    /// Toggle update output information, defaults to `true`.
    pub fn show_output(&mut self, show: bool) -> &mut Self {
        self.show_output = show;
        self
    }

    /// Toggle download confirmation. Defaults to `false`.
    pub fn no_confirm(&mut self, no_confirm: bool) -> &mut Self {
        self.no_confirm = no_confirm;
        self
    }

    /// Confirm config and create a ready-to-use `Update`
    ///
    /// * Errors:
    ///     * Config - Invalid `Update` configuration
    pub fn build(&self) -> Result<Update, Error> {
        Ok(Update {
            repo_owner: if let Some(ref owner) = self.repo_owner {
                owner.to_owned()
            } else {
                bail!(Error::Config, "`repo_owner` required")
            },
            repo_name: if let Some(ref name) = self.repo_name {
                name.to_owned()
            } else {
                bail!(Error::Config, "`repo_name` required")
            },
            target: if let Some(ref target) = self.target {
                target.to_owned()
            } else {
                bail!(Error::Config, "`target` required")
            },
            bin_name: if let Some(ref name) = self.bin_name {
                name.to_owned()
            } else {
                bail!(Error::Config, "`bin_name` required")
            },
            bin_install_path: if let Some(ref path) = self.bin_install_path {
                path.to_owned()
            } else {
                bail!(Error::Config, "`bin_install_path` required")
            },
            bin_path_in_archive: if let Some(ref path) = self.bin_path_in_archive {
                path.to_owned()
            } else {
                bail!(Error::Config, "`bin_path_in_archive` required")
            },
            current_version: if let Some(ref ver) = self.current_version {
                ver.to_owned()
            } else {
                bail!(Error::Config, "`current_version` required")
            },
            target_version: self.target_version.as_ref().map(|v| v.to_owned()),
            show_download_progress: self.show_download_progress,
            show_output: self.show_output,
            no_confirm: self.no_confirm,
        })
    }
}

/// Updates to a specified or latest release distributed via GitHub
#[derive(Debug)]
pub struct Update {
    repo_owner: String,
    repo_name: String,
    target: String,
    current_version: String,
    target_version: Option<String>,
    bin_name: String,
    bin_install_path: PathBuf,
    bin_path_in_archive: PathBuf,
    show_download_progress: bool,
    show_output: bool,
    no_confirm: bool,
}
impl Update {
    /// Initialize a new `Update` builder
    pub fn configure() -> Result<UpdateBuilder, Error> {
        UpdateBuilder::new()
    }

    fn get_latest_release(repo_owner: &str, repo_name: &str) -> Result<Release, Error> {
        set_ssl_vars!();
        let api_url = format!(
            "https://api.github.com/repos/{}/{}/releases/latest",
            repo_owner, repo_name
        );
        let mut resp = http::get(&api_url)?;
        if !resp.status().is_success() {
            bail!(
                Error::Network,
                "api request failed with status: {:?} - for: {:?}",
                resp.status(),
                api_url
            )
        }
        let json = resp.json::<serde_json::Value>()?;
        Ok(Release::parse(&json)?)
    }

    fn get_release_version(repo_owner: &str, repo_name: &str, ver: &str) -> Result<Release, Error> {
        set_ssl_vars!();
        let api_url = format!(
            "https://api.github.com/repos/{}/{}/releases/tags/{}",
            repo_owner, repo_name, ver
        );
        let mut resp = http::get(&api_url)?;
        if !resp.status().is_success() {
            bail!(
                Error::Network,
                "api request failed with status: {:?} - for: {:?}",
                resp.status(),
                api_url
            )
        }
        let json = resp.json::<serde_json::Value>()?;
        Ok(Release::parse(&json)?)
    }

    fn print_flush(&self, msg: &str) -> Result<(), Error> {
        if self.show_output {
            print_flush!("{}", msg);
        }
        Ok(())
    }

    fn println(&self, msg: &str) {
        if self.show_output {
            println!("{}", msg);
        }
    }

    pub fn update(self) -> Result<Status, Error> {
        self.println(&format!("Checking target-arch... {}", self.target));
        self.println(&format!(
            "Checking current version... v{}",
            self.current_version
        ));

        let release = match self.target_version {
            None => {
                self.print_flush("Checking latest released version... ")?;
                let release = Self::get_latest_release(&self.repo_owner, &self.repo_name)?;
                {
                    let release_tag = release.version();
                    self.println(&format!("v{}", release_tag));

                    if version::compare(&self.current_version, &release_tag)? <= 0 {
                        return Ok(Status::UpToDate(self.current_version));
                    }

                    self.println(&format!(
                        "New release found! v{} --> v{}",
                        &self.current_version, release_tag
                    ));
                    let qualifier =
                        if version::is_compatible(&self.current_version, &release_tag)? {
                            ""
                        } else {
                            "*NOT* "
                        };
                    self.println(&format!("New release is {}compatible", qualifier));
                }
                release
            }
            Some(ref ver) => {
                self.println(&format!("Looking for tag: {}", ver));
                Self::get_release_version(&self.repo_owner, &self.repo_name, ver)?
            }
        };

        let target_asset = release.asset_for(&self.target).ok_or_else(|| {
            format_err!(
                Error::Release,
                "No asset found for target: `{}`",
                self.target
            )
        })?;

        if self.show_output || !self.no_confirm {
            println!("\n{} release status:", self.bin_name);
            println!("  * Current exe: {:?}", self.bin_install_path);
            println!("  * New exe release: {:?}", target_asset.name);
            println!("  * New exe download url: {:?}", target_asset.download_url);
            println!("\nThe new release will be downloaded/extracted and the existing binary will be replaced.");
        }
        if !self.no_confirm {
            // TODO confirmation flow confirm("Do you want to continue? [Y/n] ")?;
        }

        let tmp_dir_parent = self
            .bin_install_path
            .parent()
            .ok_or_else(|| Error::Updater("Failed to determine parent dir".into()))?;
        let tmp_dir =
            tempdir::TempDir::new_in(&tmp_dir_parent, &format!("{}_download", self.bin_name))?;
        let tmp_archive_path = tmp_dir.path().join(&target_asset.name);
        let mut tmp_archive = fs::File::create(&tmp_archive_path)?;

        self.println("Downloading...");
        http::download(&target_asset.download_url, &mut tmp_archive, self.show_download_progress)?;

        self.print_flush("Extracting archive... ")?;
        Extract::from_source(&tmp_archive_path)
            .extract_file(&tmp_dir.path(), &self.bin_path_in_archive)?;
        let new_exe = tmp_dir.path().join(&self.bin_path_in_archive);
        self.println("Done");

        self.print_flush("Replacing binary file... ")?;
        let tmp_file = tmp_dir.path().join(&format!("__{}_backup", self.bin_name));
        Move::from_source(&new_exe)
            .replace_using_temp(&tmp_file)
            .to_dest(&self.bin_install_path)?;
        self.println("Done");
        Ok(Status::Updated(release.version().to_string()))
    }
}
