# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm - if you use pnpm, otherwise adjust for npm or yarn
# RUN npm install -g pnpm

# Copy package.json and lock file
COPY package.json ./
# COPY pnpm-lock.yaml ./ # If using pnpm
COPY package-lock.json ./ # If using npm

# Install dependencies
RUN npm install
# RUN pnpm install --frozen-lockfile # If using pnpm

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
# Optionally, define a port, Next.js default is 3000
# ENV PORT=3000

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

# Start the Next.js application
# The server.js file is created by the `output: 'standalone'` build option
CMD ["node", "server.js"]
