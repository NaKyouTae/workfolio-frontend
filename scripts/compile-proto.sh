#!/bin/bash

# proto 파일이 변경되지 않았으면 스킵 (빌드 시간 단축)
PROTO_DIR="./public/proto"
GENERATED_DIR="./src/generated"
PROTO_FILES=$(find "$PROTO_DIR" -name "*.proto" -type f)

# generated 디렉토리가 없거나 proto 파일이 더 최신이면 컴파일
NEED_COMPILE=false

if [ ! -d "$GENERATED_DIR" ] || [ -z "$(ls -A $GENERATED_DIR 2>/dev/null)" ]; then
  NEED_COMPILE=true
else
  # proto 파일 중 하나라도 generated 파일보다 최신이면 컴파일
  for proto_file in $PROTO_FILES; do
    if [ "$proto_file" -nt "$GENERATED_DIR" ]; then
      NEED_COMPILE=true
      break
    fi
  done
fi

if [ "$NEED_COMPILE" = false ]; then
  echo "Proto files are up to date, skipping compilation..."
  exit 0
fi

# protoc 경로 결정
if command -v protoc &> /dev/null; then
  PROTOC_CMD="protoc"
else
  PROTOC_CMD="/tmp/protoc/bin/protoc"
fi

# generated 디렉토리 생성
mkdir -p "$GENERATED_DIR"

echo "Compiling proto files..."

# proto 파일 컴파일
$PROTOC_CMD \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out="$GENERATED_DIR" \
  --ts_proto_opt=esModuleInterop=true,forceLong=number,useOptionals=true \
  --proto_path="$PROTO_DIR" \
  "$PROTO_DIR"/*.proto

echo "Proto compilation completed."
