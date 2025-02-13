#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Initializing Shapes Admin project...${NC}"

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from example...${NC}"
    cp .env.example .env
fi

# Initialize webui
echo -e "${BLUE}Setting up web interface...${NC}"
cd src/webui

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating frontend .env file from example...${NC}"
    cp .env.example .env
fi

# Return to root directory
cd ../..

# Initialize git hooks
echo -e "${BLUE}Setting up git hooks...${NC}"
npm run prepare

echo -e "${GREEN}Project initialization complete!${NC}"
echo -e "${GREEN}You can now start the development servers with:${NC}"
echo -e "${BLUE}npm run dev${NC}"
