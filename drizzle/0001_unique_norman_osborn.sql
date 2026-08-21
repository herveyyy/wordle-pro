CREATE TABLE "room" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"word_length" integer DEFAULT 5 NOT NULL,
	"max_chances" integer DEFAULT 6 NOT NULL,
	"time_limit_seconds" integer DEFAULT 60 NOT NULL,
	"total_rounds" integer DEFAULT 3 NOT NULL,
	"bot_count" integer DEFAULT 2 NOT NULL,
	"bot_difficulty" varchar(32) DEFAULT 'medium' NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"passkey" varchar(32),
	"words" text NOT NULL,
	"host_id" varchar(36),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "room_hostId_idx" ON "room" USING btree ("host_id");