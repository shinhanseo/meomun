-- Align stored place fields with Kakao Local API response names.
ALTER TABLE "places"
RENAME COLUMN "address" TO "address_name";

ALTER TABLE "places"
RENAME COLUMN "category" TO "category_name";

ALTER TABLE "places"
ADD COLUMN "road_address_name" TEXT;

ALTER TABLE "places"
ALTER COLUMN "address_name" SET NOT NULL,
ALTER COLUMN "kakao_place_id" SET NOT NULL;

-- Store the stable S3 object key instead of a temporary or public image URL.
ALTER TABLE "record_images"
RENAME COLUMN "image_url" TO "object_key";

CREATE UNIQUE INDEX "record_images_object_key_key"
ON "record_images"("object_key");
