use std;
use zip::result::ZipError;
use reqwest;
use super::super::file;
use super::super::http;
use super::super::version;

#[derive(Debug)]
pub enum Error {
    Updater(String),
    Release(String),
    Network(String),
    Config(String),
    Io(std::io::Error),
    Zip(ZipError),
    File(file::Error),
    Version(version::Error),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        use Error::*;
        match *self {
            Updater(ref s) => write!(f, "UpdaterError: {}", s),
            Release(ref s) => write!(f, "ReleaseError: {}", s),
            Network(ref s) => write!(f, "NetworkError: {}", s),
            Config(ref s) => write!(f, "ConfigError: {}", s),
            Io(ref e) => write!(f, "IoError: {}", e),
            Zip(ref e) => write!(f, "ZipError: {}", e),
            File(ref e) => write!(f, "FileError: {}", e),
            Version(ref e) => write!(f, "VersionError: {}", e),
        }
    }
}

impl std::error::Error for Error {
    fn description(&self) -> &str {
        "Updater Error"
    }

    fn cause(&self) -> Option<&std::error::Error> {
        use Error::*;
        Some(match *self {
            Io(ref e) => e,
            _ => return None,
        })
    }
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Error::Io(e)
    }
}

impl From<file::Error> for Error {
    fn from(e: file::Error) -> Self {
        Error::File(e)
    }
}

impl From<http::Error> for Error {
    fn from(e: http::Error) -> Self {
        Error::Network(e.to_string())
    }
}

impl From<reqwest::Error> for Error {
    fn from(e: reqwest::Error) -> Self {
        Error::Network(e.to_string())
    }
}

impl From<version::Error> for Error {
    fn from(e: version::Error) -> Self {
        Error::Version(e)
    }
}
