/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE user_user_id_seq;
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT NOT NULL,
ALTER COLUMN "user_id" SET DEFAULT nextval('user_user_id_seq'),
ALTER COLUMN "password_hash" DROP NOT NULL;
ALTER SEQUENCE user_user_id_seq OWNED BY "User"."user_id";

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
