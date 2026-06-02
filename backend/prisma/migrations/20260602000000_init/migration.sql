-- CreateEnum
CREATE TYPE "Emotion" AS ENUM (
    'ANGRY',
    'ANXIOUS',
    'CALM',
    'FLUTTER',
    'HAPPY',
    'REFLECTIVE',
    'SAD',
    'TIRED'
);

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'ANONYMOUS');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "nickname" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(10,6) NOT NULL,
    "category" TEXT,
    "kakao_place_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "place_id" UUID NOT NULL,
    "emotion" "Emotion" NOT NULL,
    "content" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "recorded_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record_images" (
    "id" UUID NOT NULL,
    "record_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "record_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "places_kakao_place_id_key" ON "places"("kakao_place_id");

-- CreateIndex
CREATE INDEX "records_user_id_recorded_at_idx" ON "records"("user_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "records_place_id_idx" ON "records"("place_id");

-- CreateIndex
CREATE INDEX "records_emotion_idx" ON "records"("emotion");

-- CreateIndex
CREATE INDEX "record_images_record_id_idx" ON "record_images"("record_id");

-- CreateIndex
CREATE UNIQUE INDEX "record_images_record_id_sort_order_key" ON "record_images"("record_id", "sort_order");

-- AddForeignKey
ALTER TABLE "users"
ADD CONSTRAINT "users_id_fkey"
FOREIGN KEY ("id") REFERENCES "auth"."users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records"
ADD CONSTRAINT "records_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records"
ADD CONSTRAINT "records_place_id_fkey"
FOREIGN KEY ("place_id") REFERENCES "places"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record_images"
ADD CONSTRAINT "record_images_record_id_fkey"
FOREIGN KEY ("record_id") REFERENCES "records"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

