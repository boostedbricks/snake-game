FROM nginx:alpine

# Copy game files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY snake.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Copy custom nginx config (optional - for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod 644 /usr/share/nginx/html/*.html /usr/share/nginx/html/*.js /usr/share/nginx/html/*.css

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
