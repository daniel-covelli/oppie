-- CreateEnum
CREATE TYPE "CodeOutputType" AS ENUM ('RTT', 'PYTHON');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "codeOutputType" "CodeOutputType";
