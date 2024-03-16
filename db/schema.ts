import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  integer,
  time,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

const dayOfWeekEnum = pgEnum("day_of_week", [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
]);

// User table
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
});

// User relations
const usersRelations = relations(users, ({ many }) => ({
  availabilities: many(availabilities),
}));

// Availabilities table
const availabilities = pgTable("availability", {
  id: serial("id").primaryKey(),
  user: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  dayOfWeek: dayOfWeekEnum("day_of_week"),
  startTime: time("start_time", { withTimezone: true }).notNull(),
  endTime: time("end_time", { withTimezone: true }).notNull(),
});

// Availabilities relations
const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  user: one(users, {
    fields: [availabilities.user],
    references: [users.id],
  }),
}));

// Preference table
const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  user: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bufferBefore: integer("buffer_before").notNull(),
  bufferAfter: integer("buffer_after").notNull(),
  maxMeetingsPerDay: integer("max_meetings_per_day").notNull(),
});

// Preference relations
const preferencesRelations = relations(preferences, ({ one }) => ({
  user: one(users, {
    fields: [preferences.user],
    references: [users.id],
  }),
}));

// Meetings table
const meetings = pgTable("meetings", {
  id: integer("id").primaryKey(),
  organizerId: integer("organizer_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  attendeeId: integer("attendee_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  startTime: time("start_time", { withTimezone: true }).notNull(),
  endTime: time("end_time", { withTimezone: true }).notNull(),
});

// Meetings table
const meetingsRelations = relations(meetings, ({ one }) => ({
  organizerId: one(users, {
    fields: [meetings.organizerId],
    references: [users.id],
  }),
  attendeeId: one(users, {
    fields: [meetings.attendeeId],
    references: [users.id],
  }),
}));

type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

type Availability = typeof availabilities.$inferSelect;
type NewAvailability = typeof availabilities.$inferInsert;

type Preference = typeof preferences.$inferSelect;
type NewPreference = typeof preferences.$inferInsert;

type Meeting = typeof meetings.$inferSelect;
type NewMeeting = typeof meetings.$inferInsert;

export {
  users,
  availabilities,
  preferences,
  meetings,
  dayOfWeekEnum,
  usersRelations,
  availabilitiesRelations,
  preferencesRelations,
  meetingsRelations,
};

export type {
  User,
  NewUser,
  Availability,
  NewAvailability,
  Preference,
  NewPreference,
  Meeting,
  NewMeeting,
};
