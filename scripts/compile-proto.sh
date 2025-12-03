#!/bin/bash

# protoc 경로 결정
if command -v protoc &> /dev/null; then
  PROTOC_CMD="protoc"
else
  PROTOC_CMD="/tmp/protoc/bin/protoc"
fi

# generated 디렉토리 생성
mkdir -p ./src/generated

# proto 파일 컴파일
$PROTOC_CMD \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=./src/generated \
  --ts_proto_opt=esModuleInterop=true,forceLong=number,useOptionals=true \
  --proto_path=./public/proto \
  ./public/proto/*.proto

