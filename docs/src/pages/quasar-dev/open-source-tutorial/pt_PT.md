*Uma introdução aprofundada ao código-fonte aberto com alguns exemplos específicos retirados da abordagem utilizada pelo Quasar Framework, tal como temos a intenção de usar este tutorial como treino e referência para todos os próximos (e existentes) colaboradores.*

### Repositório

https://github.com/nothingismagick/quasar-articles/blob/master/tutorials/openSourceTutorial.md

<center>
  <img src="https://ipfs.busy.org/ipfs/QmNh5ir9k6hrJNZNnhYXKgvMGfAzUPWFiVyDmss2J3kacJ" alt="GPL_MIT_glow.png" /> Imagem: CC0 por @nothingismagick
</center>

### O que será discutido?

> Você Aprenderá sobre código-aberto e as melhores práticas para assegurar que as suas contribuições são compatíveis.

#### **Introdução**

- Aprenderá sobre a diferença entre direitos de autor, licenciamento e atribuição
- Descobrirá o significado de "Software Free/Libre e Open Source"
- Descobrirá qual é a diferença entre licenças "Permissivas" e "Protetoras"
- Aprenderá sobre a descoberta de licenças e acordos de licenciamento
- Aprenderá como usar código e outros activos de código-fonte aberto

#### **A sua identidade e direitos**

- Aprenderá sobre "Acordos de não divulgação" (NDA)
- Aprenderá sobre "Contratos de Licença de Colaborador" (CLA)
- Aprenderá como tornar-se num colaborador "verificado"
- Aprenderá porque os "certificados de origem do desenvolvedor" são utilizados
- Aprenderá o que significa "assinado por"
- Aprenderá sobre formulários de "lançamento"
- Aprenderá sobre "proveniência"

#### **Tipos de Licença**

- Licenças para código
- Licenças para texto / documentação
- Licenças para arte / design / vídeo
- Licenças para tipografia

### Requisitos

- Deve ler inglês proficientemente
- Compreensão básica de `git` 
- Conhecimento dos tipos de ficheiros relevantes para a sua área de actividade 

### Dificuldade

- Básico a médio

# Conteúdo do Tutorial

> Este tutorial é uma iniciação para aqueles que estejam interessados em contribuir para projectos de código-aberto. Também pode ser útil para colaboradores activos que sempre tiveram curiosidade sobre tópicos avançados. E finalmente, porque o licenciamento pode ser muito controverso, este é também um texto para aqueles que querem se envolver numa discussão sobre código-fonte aberto. Embora usemos exemplos específicos do "Quasar Framework", as questões aqui presentes são relevantes através de todo o espectro de desenvolvimento de software de código-aberto.
> 
> Esperamos que ganhe uma visão mais aprofundada sobre todas as grandes coisas (e potenciais armadilhas) que existem em torno das licenças no mundo do software de código-fonte aberto. A introdução é um óptimo lugar para se começar, pois esta define alguns dos termos a que este tutorial recorrerá constantemente. Também ensinará sobre alguns métodos simples para garantir que as suas contribuições são complacentes com o plano de licenciamento assumido pelo projecto com o qual trabalhará. Então, tem início uma discussão sobre você, o colaborador, e os direitos e responsabilidades que tem. Finalmente, irá aprofundar-se sobre vários domínios do licenciamento, incluindo código, cópia, design e tipografia.

## Prefácio

> Alguns softwares tem código-fonte que apenas a pessoa, equipa, ou organização que o criaram - e mantém controlo exclusivo sobre o mesmo - podem modificar. As pessoas chamam a este software de "proprietário" ou software de "código fonte fechado". ... O software de código-fonte aberto é diferente. Os seus autores [tornam o seu código-fonte disponível](https://opensource.com/business/13/5/open-source-your-code) para outros que pretendam ver esse código, copiá-lo, aprender com ele, alterá-lo, ou partilhá-lo. [LibreOffice](https://www.libreoffice.org/) e o [Programa de Manipulação de Imagem GNU](http://www.gimp.org/) são exemplos de software de código-fonte aberto.

https://opensource.com/resources/what-open-source

Todo o acto criativo pode ser atribuído a alguém ou a um grupo de pessoas a trabalhar em conjunto. De facto, é algo tonto pensar que qualquer coisa existe num vácuo. Estamos todos ligados, e as ideias são coisas que frequentemente seguem as suas próprias vidas. Contudo, nestes tempos modernos muitas pessoas começaram a proteger as suas ideias de serem roubadas doando-as - publicando o seu trabalho para que outras pessoas sejam potencializadas e convidadas a contribuir para o projecto - ou até leva-las numa direcção completamente diferente.

Diferente da forma como as corporações dos séculos passados protegiam os seus segredos comerciais, o argumento de uma protecção "proprietária" das ideias e uma santificação do "código fonte fechado" na legislação e nos acordos de livre comércio podem ser rastreadas directamente até muitos dos problemas que o turbo-capitalismo libertou sobre o nosso planeta. Mas adivinhe só - há algo que você pode fazer. Você pode participar no movimento de código-aberto.

## Introdução

### Direitos de Autor, Licenciamento e Atribuição

É geralmente aceite na sociedade democrática moderna que um aviso de direitos de autor (copyright) é requerido como um prefácio para todas as licenças, porque alguém tem que ser responsável por declarar como a coisa que está sendo licenciada pode ser usada. Numa estranha (mas de alguma forma lógica) reviravolta, se desejar compartilhar o seu trabalho como de Domínio Público ou Copyleft, tem primeiro que declarar que é o dono do seu trabalho (e que todos os que contribuíram concordam com essa decisão).

Assim que um direito de autor é declarado, o detentor dos direitos de autor pode informar aos leitores e usuários do código / texto / arte sob quais as circunstâncias em que é apropriado usá-lo. Independentemente da abordagem de licenciamento adoptada pelo autor original / detentor dos direitos de autor, é sempre apropriado manter cópias dessas licenças no repositório que hospeda o seu trabalho, caso ele use obras licenciadas de terceiros de código aberto. Nunca é permitido remover ou editar arquivos de licença ou referências de licença nos cabeçalhos ou meta-dados dos arquivos fonte - porque isso é literalmente roubo e uma forma de plágio.

Enquanto os "consumidores" dos artefactos que contruiu (website, aplicação, etc.) sejam informados de onde podem ver as licenças dos projectos de terceiros que você usou para criar o seu projecto, você pode evitar o envio dessas licenças.

Se decidir usar qualquer coisa feita por um terceiro dentro do seu trabalho, excepto para trabalhos de domínio público (que eu pessoalmente acredito que você também deveria citar), é obrigado (legal e moralmente) a citar a fonte. Isto é chamado **atribuição**, e uma regra geral é que deve incluir referências para todo o código que usar. Abordaremos isto melhor mais tarde neste tutorial, porque existem diferentes requisitos dependendo do domínio do recurso a ser atribuído.

### "Software Free/Libre e de Código Aberto"

> O termo "código aberto" refere-se a algo que as pessoas podem modificar e partilhar porque o seu desenho é publico e acessível.
> 
> https://opensource.com/resources/what-open-source

Existe uma discussão perpétua pelos conservadores duros de FLOSS sobre o grau de **liberdade** inerente ao código "aberto" - e até o que significa **livre**. No entanto, é provavelmente uma boa ideia recuar no tempo até 1998 e [ler este artigo](https://opensource.com/article/18/2/coining-term-open-source-software) da autoria da mulher que inventou o nome "código aberto": Christine Peterson. Apesar de Richard Stallman e Linus Torvalds serem dois dos proponentes com maior visibilidade, voz, e sucesso, sobre o assunto; o ponto é que apesar de o termo ter começado como um "mecanismo de marketing", ele pegou e mudou as vidas de todos no planeta - definitivamente para melhor.

Stallman e a "Free Softwear Foundation" (FSF), a qual definitivamente se tem existido por mais tempo, definirão liberdade como uma parte importante do código aberto, porque a sua liberdade para usar o código e modificá-lo é também uma responsabilidade que você deverá suportar em nome de toda a comunidade.

<center><strong>O que é a liberdade? O que é "libre"?</strong></center>

Se se ignorar por momentos o facto irritante de que *livre* também significa "não custa dinheiro nenhum" (que era o argumento principal para acrescentar a palavra "libre"), existe ainda uma questão semântica por resolver, que de facto, a mesma nunca se resolverá:

Dependendo da sua perspectiva, a Gnu Public License não é ABSOLUTAMENTE livre, porque vem com o requerimento de que você deve devolver as alterações que faça ao código à comunidade - e ser livre significaria que você decidiria como trabalhar e o que fazer com o código utilizado. Ao mesmo tempo e num espectro diferente, existem aqueles que consideram a licença do MIT como não sendo completamente livre. Eles fazem-no porque existem circunstâncias em que o código pode ser permissivamente modificado e não devolvido à comunidade - num certo sentido "aprisionando" o código.

> There is no right or wrong answer here, because it is a matter of perspective - however every developer and every organisation needs to decide for themselves where they want to put the focus of their attention. At the Quasar Framework, we are not purists in the sense that we believe Code is in and of itself a spiritual being deserving of transferrable rights. If perhaps we were working on the Linux kernel that might be different - but we are more concerned with the human side of code and believe that the people who use our project should have the ultimate freedom of choice to do what they want. This is why we have taken the "permissive" approach and chosen the MIT license.

There is often a great deal of discussion around "how free to make the code". I propose that you ask yourself four questions:

1. Do you prefer to work alone?
2. Are you worried about people stealing your idea?
3. Have you written all of the code yourself, including the libraries?
4. Have you signed any type of Non Disclosure Agreement regarding the work in question?

If you answered **no** to any of these questions, then using an open source license for your work is a great way to go.

If you answered **yes** to all of these questions, then considering licensing your work as open-source is probably still one of the best ways to protect your work and make sure that it has an impact on the rest of the world. Just think of it this way: if all of the software around you today was not open source, would you still be able to work as you do? Don't you owe it to the community to share your work?

### Permissive vs. Protective licensing

One of the common misconceptions about licensing your project with GPL is that it will prevent corporations from taking your idea and using it to make money - all without giving you any cut of the profits. This is patently untrue. If someone wants to steal your code and break the law, they will. If a corporation wants to use your GPL library, they can isolate it from the rest of their system and reveal nothing of their proprietary code. They can take your code, reverse engineer it and rewrite it. If this is your biggest concern, then stop, go back to the beginning of this tutorial and read carefully to decide if you want to participate in open-source - or merely profit from it.

MIT, BSD and Apache are what the open-source software community calls "permissive" licenses. Permissive means that the author is permitting you a great deal of rights to use the software they are sharing, even the right to use it for making a profit and changing it to suit your purposes. As long as you retain copies of the original license and inform those who are interested that you are using that particular software, then you can do anything with the code - even change it and not tell anyone you have done so.

> Copyleft is the practice of offering people the right to freely distribute copies and modified versions of a work with the stipulation that the same rights be preserved in [derivative works](https://en.wikipedia.org/wiki/Derivative_works) created later. https://en.wikipedia.org/wiki/Copyleft

This type of "protective" licensing goes beyond the "permissive" licensing seen with MIT and APACHE by seeking to protect the code and the community's rights. Any modifications made to the source code must be returned to the community, and you may not sublicense the code. GPL and CC-SA are two licenses that work this way.

### License discovery and licensing requirements

Using open-source software in your projects is a great thing, but you need to stay diligent, especially when you are contributing work to another project. And this is doubly true if you are required to do reporting about license compliance (for example in the case of public agencies or within corporate legal firewalls). In any case, it can be a bit of a hassle to manually go through and track down all the license files.

There are a few projects that treat this issue of discovery, such as [nlf](https://www.npmjs.com/package/nlf) and [https://fossa.io/](https://fossa.io/ "https://fossa.io/") and specifically [their free **CLI** that does not require registration](https://github.com/fossas/fossa-cli).

    $ nlf --summary detail > nlf.txt
    

[Here is a report made from the Quasar repo using the **nlf** approach.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/nlf_report_licenses_quasar.txt.md)

If you want to see a license report generated by the **fossa CLI** in your repository, after following their install instructions, you can just use this command:

    $ fossa report licenses > fossa.txt
    

[Here is a report made from the Quasar repo using the **fossa cli** approach.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/fossa_report_licenses_quasar.txt.md) As you can see, the great majority of modules use the MIT license, but several are not clear from the report alone: 15 of the projects were not autodetected by **fossa**. I followed each of the links, tracked down their licenses, and made a note not only of the license, but that I was the one who did it.

Furthermore, I detected that only one of our libraries (stylint) requires a GPL license, but the developers have a license conflict in the declaration in the package.json (GPL-2) and the actual license file (GPL-3).

That is what you will need to do as well. Should a license file not be included in the project, and you cannot find one, it is wise to contact the author.

**A word of caution**: These automated systems are not foolproof (e.g. a module about license detection may detect multiple licenses, even though it is itself using another license). If you are bound by regulatory compliance, you need to go through them all by hand - and don't be afraid to reach out to the author if you need clarification - or even a different license. This is sometimes possible. Just remember, it's better to ask permission than forgiveness.

### Using open-source

If you use anything that is open-source, you must declare its use and make the original licenses easily accessible. If you are using, for example, node modules in your project, then these licenses are available in the source code of the project when someone downloads the project files and "installs" the dependencies. You can usually find it as a file named `LICENSE` in the root folder or in the "license" field in the `package.json`

Generally this is enough, however if you make any changes to the original library, you may be required to notify and / or submit these changes back to the community. This depends on the license type, but we will cover licensing specifics in the final section.

> **Stack Overflow**: A common pitfall is to merely copy and paste things that you find on stackoverflow.com - but this is dangerous, because even though it is implied that the user is sharing this information, you do not know with 100% certainty that it is appropriate (or permitted) to use the code example 1 to 1. The common practice of citing the resource is better than nothing, but you should really consider rewriting the example to fit your code style, the needs of your project AND reference the source as "inspiration".

## Your Identity and Rights

### What is a "Non-Disclosure Agreement" (NDA)

A non-disclosure agreement is a contract that you may be required to sign if you will be working with an organisation that has trade secrets to protect. As the signee of the NDA, you will be bound by the contract to maintain secrecy about the information you have been given, and it may include clauses about non-competition in a similar industry for a specific amount of time. Although this is generally uncommon in the open-source industry, it may be required if you are given access to "secrets" like API keys, logins and the like.

> If you are presented with a NDA, as with any contract, it is wise to read everything, ask questions and ask a lawyer for their opinion. Quasar will never require you to sign an NDA.

### What is a "Contributor License Agreement" (CLA)

A Contributor License Agreement is a contract between the owner of a project and code contributors. As opposed to a NDA (which is restrictive), a CLA is "reciprocal" in that it is actually there to protect the rights of both owner and contributor. With a CLA, contributors explicitly give the owner permission to use the contribution, and owners explicitly permit the contributor to use their contributions as they see fit.

However, many developers consider a CLA to be problematic because of the rights that they confer upon the owner, which include the ability to change the license of the code. [Here is a great writeup by gitlab](https://about.gitlab.com/2017/11/01/gitlab-switches-to-dco-license/) about why they switched from a CLA to a DCO - and here is their [in-depth analysis from a project-management perspective](https://docs.google.com/a/gitlab.com/document/d/1zpjDzL7yhGBZz3_7jCjWLfRQ1Jryg1mlIVmG8y6B1_Q/edit?usp=sharing).

### What is a "Developer Certificate of Origin" (DCO)

A Developer Certificate of Origin is a legal statement made by a contributor where they certify that they themselves have authored the contribution and that they have legal authority to contribute this code. As with the Gitlab example above, this is usually made in combination with a license such as MIT or Apache. You can read the entire license here (it's brief): https://developercertificate.org/

By adding the `signed-off-by` flag to your git commit, you are saying that you are acting in accordance with the DCO. Although not necessary for every commit, it is there to provide a sort of "blame-chain" in case things go wrong. Best practice suggests using the real name of the contributor. You can read more about the details of doing this here: https://stackoverflow.com/a/1962112

Some IDE's, like [Webstorm](https://www.jetbrains.com/help/webstorm/2017.2/using-git-integration.html#commit), offer you the ability to add this flag directly from the commit window when you are reviewing your code. It will add the following line to the end of the commit message: `Signed off by: <username>`

Please note, if the managers of the project you are working on ask you to sign off, check to make sure that they really want you to sign off with every commit, or if it is enough to sign-off on tags or PR's. Technically speaking, the person doing the merge is the one who is required to sign-off, but by adding your name to the individual commits it becomes clear who was really responsible for which changes. It is a matter of preference.

> At Quasar we ask you to sign-off on all commits.

### Become a "verified" contributor

Verified contributors on Github or Gitlab are developers who have added a GPG key to their account and use this GPG key to sign their commits. Although it is not necessary for integration, some project managers may require it - especially since it is easier to steal someone's login credentials and modify a critical repository than it is steal their GPG key.

The following links will show you how to create a GPG key and use them with Github or Gitlab, as needed.

- [Add a GPG Key to Github](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/)
- [Signing commits on Gitlab](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/index.html)
- https://blog.github.com/2016-04-05-gpg-signature-verification/
- https://stackoverflow.com/questions/10161198/is-there-a-way-to-autosign-commits-in-git-with-a-gpg-key

### When do I need to get "release" forms

A release form is generally required when making photographs of people and private property - and using them for any non-private purpose. Although specifics vary from jurisdiction to jurisdiction, it is very important that you get people to sign a release form, and if it is clear WHERE the picture was taken, then you might need to get permission of the owner.

> One clever way to deal with a release form for humans (if they genuinely want to support you) is a so-called "reciprocal pay". Before the photo-shooting, prepare two receipts. On one receipt you pay them e.g. 5 EUR for being a model. On the other receipt, they pay you e.g. 5 EUR for a copy of the photograph. The rule (got the cash, keep the copy) applies, so each party has one original receipt and one copy receipt. You send them a digital copy of the final image as a link to the open-source repository where it was used, and note this on the copy of the receipt they gave you. Keep this in your own records, and everybody is happy.

If you do use photographs of people that you have made and submit them to open source projects, you need to be able to prove that the person gave you permission, and you should keep their release form on file and available.

### How can I document "provenance"

Provenance is a word that describes the history of a work. Code that is shared under an open-source license and within the context of a git repository is more or less self-documenting. Images are less obvious, and it is especially tricky with digital-collage works that combine a number of resources.

Dealing with provenance for designers is important, as rights to visual images are hotly contested and often times lead to legal battles. Even if only public-domain resources are being used, it is still a good practice to record your work in a provenance document. This type of document is like the bibliography in a scientific paper, in which the ideas and authors are recorded. Although there is no "standardised" approach, the best method is to not only record the sources and the times accessed, but also track down the licenses for each component. If you want an example of this, feel free to look at the citations section [in this graphics breakdown](https://busy.org/@nothingismagick/qcensus2018-campaign-graphics-breakdown) written in the @utopian-io style.

> The last thing anyone wants is a legal battle because it drains resources like time and money. If you are contributing to an open-source project, make sure that you are not putting them in hot-water. At Quasar, you can rest assured that the Art Department takes this VERY seriously, and violations of this trust are likely to lead to blacklisting or hammerbanning.

## License Types

### Major licenses for code

This introduction cannot possibly explain the subtle differences between all of the different licenses for code, because there are dozens. A license is added to code by either placing a reference to it in the header of the file being licensed in the case of distributables, in a LICENSE file in the root level of a repository, in the README about the project or potentially in the package.json (if using node).

If you skipped ahead and didn't read the earlier chapters, here is a quick recap of the three main license types and a popular example of each, along with two links that go into more detail and analysis.

- **Permissive**: [MIT](http://www.opensource.org/licenses/MIT)
- **Protective**: [GPL-3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- **Public Domain**: [WTFPL](http://www.wtfpl.net/)
- [Github's License Helper](https://choosealicense.com/)
- [The exhaustive list by the GNU Foundation](https://www.gnu.org/licenses/license-list.html)

> At the Quasar Framework all contributions to the core libraries are required to be MIT. By contributing anything, you are agreeing to this license.

### Important licenses for text / documentation

Text and documentation is also a creative work, and is also generally protected under copyright laws. You can transfer these rights to third parties or to project owners to whom you will be giving your contributions by choosing either a Creative Commons resource or the Free Document License.

It is considered best practice to name the license and author(s) at the end of the document being licensed.

- [Creative Commons](https://creativecommons.org/)
- [Free Documentation License](https://www.gnu.org/licenses/fdl.html)

> At the Quasar Framework all documentation is (or will be) licensed under the FDL.

### Licensing artwork / design / video

There are literally as many legal regulations for this type of contribution as there are countries on the planet, so it is absolutely inappropriate to go into detail about how things are different from nation to nation. No matter what, the person that made the image can never lose the right to say that they were the owner (unless an absolutely draconian contract prevents it - and in some cases this won't stand up in court). This is why there is one common rule that will : Cite the author and name the license. If you can't do that, then don't use the asset.

Depending on where and how the contribution is to be used, there are a number of ways in which this citation can be made:

1. Name the file accordingly
2. Put license information in a watermark in the file
3. Inject the information into the metadata of the file
4. Cite the image sources / licenses directly after the image if possible
5. Put this same information in a footnote / endnote / linked document
6. Place license information or licenses and release form-cover-sheets in the repository in the same folder as the image or some other delegated location

Common licenses to use for Images / Designs / Videos are:

- [Creative Commons](https://creativecommons.org/)
- [Public Domain / CC0](https://creativecommons.org/share-your-work/public-domain/cc0/)
- [Apache v2](https://apache.org/licenses/LICENSE-2.0)

> Quasar prefers CC-BY or CC0 licenses.

### Font licenses

Of the hundreds of fonts listed at [Google Fonts](https://fonts.google.com/attribution), there are exactly two different licenses used: Either the Apache License v2, or the SIL Open Font License v1.1. The vast majority are OFL, and it is basically the same type of permissive license as MIT.

If you are using a font, you need to make sure that you really have the license for it, as some professional font forges will sell different types of licenses depending on the application. (As in one license for desktop publishing, another for websites, etc.) If you are using an open-source font, best-practice is to put a copy of the license in the folder where you are maintaining your fonts.

Furthermore, some services like FontSquirrel offer a [WebfontGenerator](https://www.fontsquirrel.com/tools/webfont-generator) that enables designers to make a set of font-files so that individual browsers can select the type that they are most well-equipped to use. They require you to verify that you have the right to convert the font to other formats. The SIL OFL does permit this. If there is no license that you can find, assume that you do not have the right to use the font.

- [OFL-FAQ web version (1.1-update5)](https://scripts.sil.org/cms/scripts/page.php?item_id=OFL-FAQ_web)

# Final Words

Just because you "open" your work to collaboration from others, this is not the end of the story. Just because you slap a Creative Commons license on a photoshop file does not mean it is open and free. The degree of openness of an asset or project is also determined by the operating system and the software needed to use and or modify the file. Please consider publishing not only the results of the process of your work, but also inform people about how you did it.

Furthermore, please do not use pirated software when working on open-source projects. Not only is it "uncool" and damaging to the honour of the entire open-source community, you are putting yourself and your colleagues at risk, especially if you have high-value credentials, like server logins etc. There is no better way to get yourself (and possibly your team) hacked than to use cracks.

# Further Resources

In case you want to go more into depth about these topics, we have a few additional resources that we highly recommend:

- Stallman's distinction between [FLOSS and FOSS](https://www.gnu.org/philosophy/floss-and-foss.en.html)
- This chapter of the [ZeroMQ Guide](http://zguide.zeromq.org/page:all#toc141) goes into great detail about governance in open-source projects with the specific example of their community

#### Proof of Work Done (Authorship)

The original version of this article has been compiled and written by @nothingismagick https://github.com/nothingismagick

#### License

This work and all derivatives are [licensed under the FDL 1.3](https://github.com/nothingismagick/quasar-articles/blob/master/LICENSE).

> Written with [StackEdit](https://stackedit.io/).