#!/bin/bash

# protoc이 이미 설치되어 있으면 스킵
if command -v protoc &> /dev/null; then
  echo "protoc is already installed"
  exit 0
fi

# 캐시된 protoc가 있으면 사용 (Vercel 빌드 캐시 활용)
if [ -f "/tmp/protoc/bin/protoc" ] && [ -x "/tmp/protoc/bin/protoc" ]; then
  echo "Using cached protoc from /tmp/protoc/bin/protoc"
  exit 0
fi

# OS에 따라 적절한 바이너리 다운로드
OS=$(uname -s)
ARCH=$(uname -m)

if [ "$OS" = "Linux" ]; then
  PROTOC_URL="https://github.com/protocolbuffers/protobuf/releases/download/v27.1/protoc-27.1-linux-x86_64.zip"
  PROTOC_ZIP="protoc-27.1-linux-x86_64.zip"
elif [ "$OS" = "Darwin" ]; then
  if [ "$ARCH" = "arm64" ]; then
    PROTOC_URL="https://github.com/protocolbuffers/protobuf/releases/download/v27.1/protoc-27.1-osx-aarch_64.zip"
    PROTOC_ZIP="protoc-27.1-osx-aarch_64.zip"
  else
    PROTOC_URL="https://github.com/protocolbuffers/protobuf/releases/download/v27.1/protoc-27.1-osx-x86_64.zip"
    PROTOC_ZIP="protoc-27.1-osx-x86_64.zip"
  fi
else
  echo "Unsupported OS: $OS"
  exit 1
fi

echo "Downloading protoc for $OS $ARCH..."
curl -LO "$PROTOC_URL"
unzip -o "$PROTOC_ZIP" -d /tmp/protoc
chmod +x /tmp/protoc/bin/protoc
rm "$PROTOC_ZIP"

echo "protoc installed to /tmp/protoc/bin/protoc"

