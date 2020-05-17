FROM gitpod/workspace-full:latest

USER root
# Install custom tools, runtime, etc.
RUN curl -fLo /tmp/pandoc-2.2-1-amd64.deb https://github.com/jgm/pandoc/releases/download/2.2/pandoc-2.2-1-amd64.deb \
    && sudo dpkg -i /tmp/pandoc-2.2-1-amd64.deb \
    && rm /tmp/pandoc-2.2-1-amd64.deb

# Get packages in the cache
RUN apt-get update
# Install tex packages, non-interactive and quiet
RUN apt-get -qq -y install texlive-xetex
RUN apt-get -qq -y install texlive-fonts-recommended
RUN apt-get -qq -y install texlive-fonts-extra
RUN apt-get -qq -y install texlive-latex-extra

USER gitpod
# Apply user-specific settings
# ENV ...

# Give back control
USER root
