FROM ruby:3.1-alpine

# Install dependencies
RUN apk add --no-cache \
    build-base \
    gcc \
    cmake \
    git

# Set working directory
WORKDIR /app

# Copy Gemfile
COPY blog/Gemfile blog/Gemfile.lock* ./

# Install Jekyll and dependencies
RUN bundle install

# Copy blog source
COPY blog/ ./

# Expose port
EXPOSE 4000

# Default command
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"]
