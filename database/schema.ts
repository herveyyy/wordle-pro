import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: varchar("role", { length: 50 }).notNull().default("dev"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const room = pgTable(
  "room",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    wordLength: integer("word_length").notNull().default(5),
    maxChances: integer("max_chances").notNull().default(6),
    timeLimitSeconds: integer("time_limit_seconds").notNull().default(60),
    totalRounds: integer("total_rounds").notNull().default(3),
    botCount: integer("bot_count").notNull().default(2),
    botDifficulty: varchar("bot_difficulty", { length: 32 }).notNull().default("medium"),
    isPrivate: boolean("is_private").notNull().default(false),
    passkey: varchar("passkey", { length: 32 }),
    words: text("words").notNull(), // JSON string array of generated words per round
    hostId: varchar("host_id", { length: 36 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("room_hostId_idx").on(table.hostId)]
);

export const roomPlayer = pgTable(
  "room_player",
  {
    id: varchar("id", { length: 128 }).primaryKey(), // `${roomId}_${userId}`
    roomId: varchar("room_id", { length: 64 }).notNull(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    avatar: text("avatar"),
    isHost: boolean("is_host").notNull().default(false),
    isReady: boolean("is_ready").notNull().default(true),
    score: integer("score").notNull().default(0),
    roundsWon: integer("rounds_won").notNull().default(0),
    guesses: text("guesses").notNull().default("[]"), // JSON string of TileStatus[][]
    hasSolved: boolean("has_solved").notNull().default(false),
    solvedInRow: integer("solved_in_row"),
    lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
  },
  (table) => [
    index("room_player_roomId_idx").on(table.roomId),
    index("room_player_lastActive_idx").on(table.lastActiveAt),
  ]
);

export const roomEvent = pgTable(
  "room_event",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    roomId: varchar("room_id", { length: 64 }).notNull(),
    senderId: varchar("sender_id", { length: 64 }).notNull(),
    type: varchar("type", { length: 32 }).notNull(),
    payload: text("payload"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("room_event_roomId_idx").on(table.roomId),
    index("room_event_createdAt_idx").on(table.createdAt),
  ]
);

export type RoomRow = typeof room.$inferSelect;
export type RoomInsert = typeof room.$inferInsert;
export type RoomPlayerRow = typeof roomPlayer.$inferSelect;
export type RoomPlayerInsert = typeof roomPlayer.$inferInsert;
export type RoomEventRow = typeof roomEvent.$inferSelect;
export type RoomEventInsert = typeof roomEvent.$inferInsert;


