FROM gitpod/workspace-full:latest

USER root
# # Install custom tools, runtime, etc.
# RUN curl -fLo /tmp/pandoc-2.2-1-amd64.deb https://github.com/jgm/pandoc/releases/download/2.2/pandoc-2.2-1-amd64.deb \
#     && sudo dpkg -i /tmp/pandoc-2.2-1-amd64.deb \
#     && rm /tmp/pandoc-2.2-1-amd64.deb

# # Get packages in the cache
# RUN apt-get update
# # Install tex packages, non-interactive and quiet
# RUN apt-get -qq -y install texlive-xetex
# RUN apt-get -qq -y install texlive-fonts-recommended
# RUN apt-get -qq -y install texlive-fonts-extra
# RUN apt-get -qq -y install texlive-latex-extra

# USER gitpod
# # Apply user-specific settings
# # ENV ...

# # Give back control
# USER root


# FROM ubuntu

# non interactive frontend for locales
# ENV DEBIAN_FRONTEND=noninteractive
  
# installing texlive and utils
RUN apt-get update && \
    apt-get -y install --no-install-recommends pandoc texlive texlive-latex-extra texlive-extra-utils texlive-fonts-extra texlive-bibtex-extra biber latexmk make git procps locales curl && \
    rm -rf /var/lib/apt/lists/*
 
# generating locales
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
dpkg-reconfigure --frontend=noninteractive locales && \
update-locale LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8 LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
 
# installing cpanm & missing latexindent dependencies
RUN curl -L http://cpanmin.us | perl - --self-upgrade && \
cpanm Log::Dispatch::File YAML::Tiny File::HomeDir

USER gitpod
# Apply user-specific settings
# ENV ...

# Give back control
USER root
