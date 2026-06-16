// data.js - Default data and constants for Vincent OS

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const TAG_OPTIONS = [
  { value: "tag-review", label: "Review" },
  { value: "tag-course", label: "Course" },
  { value: "tag-exercise", label: "Exercise" },
  { value: "tag-chore", label: "Chores" },
  { value: "tag-laundry", label: "Laundry" },
  { value: "tag-personal", label: "Personal dev" },
  { value: "tag-church", label: "Church / busy" },
  { value: "tag-free", label: "Free time" },
];

// Three schedule modes per day. "no_laundry" is the base/default for non-laundry days.
const SCHEDULE_MODES = {
  heavy_laundry: {
    label: "Heavy laundry day",
    description: "2-3 hrs handwash. Workout becomes light stretching, review shifts to afternoon.",
  },
  light_laundry: {
    label: "Light laundry day",
    description: "Smaller load. Slightly shifted morning, normal afternoon.",
  },
  no_laundry: {
    label: "No laundry day",
    description: "Full workout, full review blocks, course module in normal slot.",
  },
};

// Premade schedule templates (selectable for any date)
const SCHEDULE_TEMPLATES = {
  heavy_laundry: {
    label: "Heavy laundry day",
    description: "2-3 hrs handwash. Workout becomes light stretching, review shifts to afternoon.",
    blocks: [
      { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
      { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - whole family load", cls: "tag-laundry" },
      { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
      { time: "9:30 - 10:00 AM", label: "Light stretching only", cls: "tag-exercise" },
      { time: "10:00 - 10:30 AM", label: "Merienda", cls: "tag-free" },
      { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
      { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
      { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
      { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
      { time: "4:00 PM - 4:30 PM", label: "Break", cls: "tag-free" },
      { time: "4:30 PM - 6:00 PM", label: "Civil service review - drills", cls: "tag-review" },
      { time: "6:00 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
      { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
      { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
    ],
    note: "Heavy load - workout becomes light stretching. Laundry, chores done before noon.",
  },
  light_laundry: {
    label: "Light laundry day",
    description: "Smaller load. Slightly shifted morning, normal afternoon.",
    blocks: [
      { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
      { time: "6:30 - 9:00 AM", label: "Laundry (handwash)", cls: "tag-laundry" },
      { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
      { time: "9:30 - 10:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
      { time: "10:15 - 10:30 AM", label: "Cool down + merienda", cls: "tag-free" },
      { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
      { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
      { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
      { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
      { time: "4:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
    ],
    note: "Laundry, workout, chores all done before review even starts.",
  },
  no_laundry: {
    label: "No laundry day",
    description: "Full workout, full review blocks, course module in normal slot.",
    blocks: [
      { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
      { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
      { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
      { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
      { time: "8:30 - 10:30 AM", label: "Civil service review - verbal & reading comp", cls: "tag-review" },
      { time: "10:30 - 10:45 AM", label: "Break", cls: "tag-free" },
      { time: "10:45 AM - 12:30 PM", label: "Data Analytics course module", cls: "tag-course" },
      { time: "12:30 PM - 1:30 PM", label: "Lunch break", cls: "tag-free" },
      { time: "1:30 PM - 3:30 PM", label: "Civil service review - grammar & language", cls: "tag-review" },
      { time: "3:30 PM - 4:00 PM", label: "Merienda / break", cls: "tag-free" },
      { time: "4:00 PM - 5:30 PM", label: "Civil service review - math & logic drills", cls: "tag-review" },
      { time: "5:30 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
      { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
      { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
    ],
    note: "Full schedule - no laundry to plan around today.",
  },
  rest_day: {
    label: "Rest / church day",
    description: "Sunday-style rest day - church, family time, full recharge.",
    blocks: [
      { time: "Morning", label: "Church + family time", cls: "tag-church" },
      { time: "Afternoon", label: "Full rest - no chores, no reviews", cls: "tag-free" },
      { time: "Evening (optional)", label: "Light reading only", cls: "tag-personal" },
      { time: "11:00 PM", label: "Lights out", cls: "tag-free" },
    ],
    note: "True rest day - recharge for the week ahead.",
  },
  mock_exam_day: {
    label: "Mock exam day",
    description: "Full-length timed mock exam plus review of weak areas.",
    blocks: [
      { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
      { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
      { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
      { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
      { time: "8:30 - 10:30 AM", label: "Civil service review - full mock exam (timed)", cls: "tag-review" },
      { time: "10:30 - 11:30 AM", label: "Review mock exam answers + weak areas", cls: "tag-review" },
      { time: "11:30 AM - 12:30 PM", label: "Lunch break", cls: "tag-free" },
      { time: "12:30 - 2:00 PM", label: "Data Analytics course module", cls: "tag-course" },
      { time: "2:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
    ],
    note: "Full-length mock exam day - track your score.",
  },
  blank: {
    label: "Blank / custom",
    description: "Start from scratch and build your own schedule for this day.",
    blocks: [],
    note: "",
  },
};

// Default schedules per day, keyed by mode. Each day has a default "activeMode".
const DEFAULT_SCHEDULE = {
  Mon: {
    activeMode: "heavy_laundry",
    badges: [{ t: "Laundry day", c: "badge-laundry" }, { t: "Study day", c: "badge-study" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - whole family load", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "10:15 - 10:30 AM", label: "Cool down + merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review - verbal & reading comp", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM - 4:30 PM", label: "Break", cls: "tag-free" },
          { time: "4:30 PM - 6:00 PM", label: "Civil service review - math & logic drills", cls: "tag-review" },
          { time: "6:00 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
          { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
          { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
        ],
        note: "Heaviest day - laundry, workout, chores all done before noon. Afternoon is course + review only.",
      },
      light_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 8:00 AM", label: "Laundry (handwash) - smaller load", cls: "tag-laundry" },
          { time: "8:00 - 8:15 AM", label: "Rest / freshen up", cls: "tag-free" },
          { time: "8:15 - 9:00 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "9:00 - 9:15 AM", label: "Cool down + breakfast", cls: "tag-free" },
          { time: "9:15 - 10:00 AM", label: "Household chores", cls: "tag-chore" },
          { time: "10:00 AM - 12:00 PM", label: "Civil service review - verbal & reading comp", cls: "tag-review" },
          { time: "12:00 - 1:00 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:00 - 2:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "2:30 PM - 3:00 PM", label: "Break", cls: "tag-free" },
          { time: "3:00 PM - 5:00 PM", label: "Civil service review - math & logic drills", cls: "tag-review" },
          { time: "5:00 - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
          { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
          { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
        ],
        note: "Smaller load - schedule mostly normal with a shorter morning laundry block.",
      },
      no_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "8:30 - 10:30 AM", label: "Civil service review - verbal & reading comp", cls: "tag-review" },
          { time: "10:30 - 10:45 AM", label: "Break", cls: "tag-free" },
          { time: "10:45 AM - 12:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "12:30 PM - 1:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:30 PM - 3:30 PM", label: "Civil service review - grammar & language", cls: "tag-review" },
          { time: "3:30 PM - 4:00 PM", label: "Merienda / break", cls: "tag-free" },
          { time: "4:00 PM - 5:30 PM", label: "Civil service review - math & logic drills", cls: "tag-review" },
          { time: "5:30 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
          { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
          { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
        ],
        note: "Full schedule - no laundry to plan around today.",
      },
    },
  },

  Tue: {
    activeMode: "no_laundry",
    badges: [{ t: "Study day", c: "badge-study" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - whole family load", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "10:15 - 10:30 AM", label: "Cool down + merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM - 5:30 PM", label: "Civil service review - drills", cls: "tag-review" },
          { time: "5:30 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
          { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
          { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
        ],
        note: "Unplanned laundry day - laundry first, everything else shifts later.",
      },
      light_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 8:00 AM", label: "Laundry (handwash) - smaller load", cls: "tag-laundry" },
          { time: "8:00 - 8:45 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "8:45 - 9:00 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "9:00 - 10:00 AM", label: "Household chores", cls: "tag-chore" },
          { time: "10:00 AM - 12:00 PM", label: "Civil service review - verbal & reading comp", cls: "tag-review" },
          { time: "12:00 - 1:00 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:00 PM - 2:45 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "2:45 PM - 3:15 PM", label: "Merienda / break", cls: "tag-free" },
          { time: "3:15 PM - 4:45 PM", label: "Civil service review - math & logic drills", cls: "tag-review" },
          { time: "4:45 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
          { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
          { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
        ],
        note: "Smaller laundry load worked into the morning.",
      },
      no_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "8:30 - 10:30 AM", label: "Civil service review - verbal & reading comp", cls: "tag-review" },
          { time: "10:30 - 10:45 AM", label: "Break", cls: "tag-free" },
          { time: "10:45 AM - 12:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "12:30 PM - 1:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:30 PM - 3:30 PM", label: "Civil service review - grammar & language", cls: "tag-review" },
          { time: "3:30 PM - 4:00 PM", label: "Merienda / break", cls: "tag-free" },
          { time: "4:00 PM - 5:30 PM", label: "Civil service review - math & logic drills", cls: "tag-review" },
          { time: "5:30 PM - 7:00 PM", label: "Free time / rest", cls: "tag-free" },
          { time: "7:00 PM - 8:00 PM", label: "Light reading / personal dev", cls: "tag-personal" },
          { time: "8:00 PM - 11:00 PM", label: "Wind down", cls: "tag-free" },
        ],
        note: "No-laundry day - chores right after workout, before review starts.",
      },
    },
  },

  Wed: {
    activeMode: "light_laundry",
    badges: [{ t: "Laundry day", c: "badge-laundry" }, { t: "Light day", c: "badge-light" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - big load", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:00 AM", label: "Light stretching only", cls: "tag-exercise" },
          { time: "10:00 - 10:30 AM", label: "Merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "Heavy load - workout becomes light stretching only. Evening unavailable.",
      },
      light_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash)", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "10:15 - 10:30 AM", label: "Cool down + merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "Laundry, workout, chores all done before review even starts. Evening unavailable.",
      },
      no_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "8:30 - 10:30 AM", label: "Civil service review", cls: "tag-review" },
          { time: "10:30 - 10:45 AM", label: "Break", cls: "tag-free" },
          { time: "10:45 AM - 12:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "12:30 PM - 1:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:30 - 3:00 PM", label: "Civil service review - drills", cls: "tag-review" },
          { time: "3:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "No laundry today - lighter review day. Evening unavailable.",
      },
    },
  },

  Thu: {
    activeMode: "no_laundry",
    badges: [{ t: "Study day", c: "badge-study" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - big load", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:00 AM", label: "Light stretching only", cls: "tag-exercise" },
          { time: "10:00 - 10:30 AM", label: "Merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM - 5:00 PM", label: "Civil service review - drills", cls: "tag-review" },
          { time: "5:00 PM onwards", label: "Church duties / unavailable", cls: "tag-church" },
        ],
        note: "Unplanned heavy laundry + church evening - tightest possible day.",
      },
      light_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 8:00 AM", label: "Laundry (handwash) - smaller load", cls: "tag-laundry" },
          { time: "8:00 - 8:45 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "8:45 - 9:45 AM", label: "Household chores", cls: "tag-chore" },
          { time: "9:45 - 11:45 AM", label: "Civil service review", cls: "tag-review" },
          { time: "11:45 AM - 12:45 PM", label: "Lunch break", cls: "tag-free" },
          { time: "12:45 - 2:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "2:30 - 4:30 PM", label: "Civil service review - drills / practice test", cls: "tag-review" },
          { time: "4:30 PM onwards", label: "Church duties / unavailable", cls: "tag-church" },
        ],
        note: "Smaller load worked into morning, finish by 4:30 PM for church duties.",
      },
      no_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "8:30 - 10:30 AM", label: "Civil service review", cls: "tag-review" },
          { time: "10:30 - 10:45 AM", label: "Break", cls: "tag-free" },
          { time: "10:45 AM - 12:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "12:30 PM - 1:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:30 PM - 3:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "3:30 PM - 5:00 PM", label: "Civil service review - drills / practice test", cls: "tag-review" },
          { time: "5:00 PM onwards", label: "Church duties / unavailable", cls: "tag-church" },
        ],
        note: "No-laundry day, church duties evening - done by 5 PM.",
      },
    },
  },

  Fri: {
    activeMode: "light_laundry",
    badges: [{ t: "Laundry day", c: "badge-laundry" }, { t: "Light day", c: "badge-light" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - big load", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:00 AM", label: "Light stretching only", cls: "tag-exercise" },
          { time: "10:00 - 10:30 AM", label: "Merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "Heavy load - workout becomes light stretching only. Evening unavailable.",
      },
      light_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash)", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "10:15 - 10:30 AM", label: "Cool down + merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:30 PM", label: "Civil service review", cls: "tag-review" },
          { time: "1:30 PM - 2:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:30 PM - 4:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "4:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "Evening unavailable.",
      },
      no_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "8:30 - 10:30 AM", label: "Civil service review", cls: "tag-review" },
          { time: "10:30 - 10:45 AM", label: "Break", cls: "tag-free" },
          { time: "10:45 AM - 12:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "12:30 PM - 1:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "1:30 - 3:00 PM", label: "Civil service review - drills", cls: "tag-review" },
          { time: "3:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "No laundry today. Evening unavailable.",
      },
    },
  },

  Sat: {
    activeMode: "light_laundry",
    badges: [{ t: "Laundry day", c: "badge-laundry" }, { t: "Light day", c: "badge-light" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash) - big load", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:00 AM", label: "Light stretching only", cls: "tag-exercise" },
          { time: "10:00 - 10:30 AM", label: "Merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:00 PM", label: "Civil service review - mock exam (shorter, timed)", cls: "tag-review" },
          { time: "1:00 PM - 2:00 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:00 PM - 3:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "3:30 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "Heavy load - mock exam shortened to fit. Evening unavailable.",
      },
      light_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 9:00 AM", label: "Laundry (handwash)", cls: "tag-laundry" },
          { time: "9:00 - 9:30 AM", label: "Rest / shower / freshen up", cls: "tag-free" },
          { time: "9:30 - 10:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "10:15 - 10:30 AM", label: "Cool down + merienda", cls: "tag-free" },
          { time: "10:30 - 11:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "11:30 AM - 1:00 PM", label: "Civil service review - mock exam (shorter, timed)", cls: "tag-review" },
          { time: "1:00 PM - 2:00 PM", label: "Lunch break", cls: "tag-free" },
          { time: "2:00 PM - 3:30 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "3:30 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "Evening unavailable. Mock exam shortened to fit - full-length mocks resume after June 30.",
      },
      no_laundry: {
        blocks: [
          { time: "6:00 - 6:30 AM", label: "Wake up + breakfast", cls: "tag-free" },
          { time: "6:30 - 7:15 AM", label: "Home workout / exercise", cls: "tag-exercise" },
          { time: "7:15 - 7:30 AM", label: "Cool down + freshen up", cls: "tag-free" },
          { time: "7:30 - 8:30 AM", label: "Household chores", cls: "tag-chore" },
          { time: "8:30 - 10:30 AM", label: "Civil service review - full mock exam (timed)", cls: "tag-review" },
          { time: "10:30 - 11:30 AM", label: "Review mock exam answers + weak areas", cls: "tag-review" },
          { time: "11:30 AM - 12:30 PM", label: "Lunch break", cls: "tag-free" },
          { time: "12:30 - 2:00 PM", label: "Data Analytics course module", cls: "tag-course" },
          { time: "2:00 PM onwards", label: "Free / prep for evening", cls: "tag-free" },
        ],
        note: "No laundry - full-length mock exam day. Evening unavailable.",
      },
    },
  },

  Sun: {
    activeMode: "no_laundry",
    badges: [{ t: "Church day", c: "badge-church" }],
    modes: {
      heavy_laundry: {
        blocks: [
          { time: "Morning", label: "Church + family time", cls: "tag-church" },
          { time: "Afternoon", label: "Full rest - no chores, no reviews", cls: "tag-free" },
          { time: "Evening (optional)", label: "Light reading only", cls: "tag-personal" },
          { time: "11:00 PM", label: "Lights out", cls: "tag-free" },
        ],
        note: "Sunday is always a rest day regardless of laundry mode.",
      },
      light_laundry: {
        blocks: [
          { time: "Morning", label: "Church + family time", cls: "tag-church" },
          { time: "Afternoon", label: "Full rest - no chores, no reviews", cls: "tag-free" },
          { time: "Evening (optional)", label: "Light reading only", cls: "tag-personal" },
          { time: "11:00 PM", label: "Lights out", cls: "tag-free" },
        ],
        note: "Sunday is always a rest day regardless of laundry mode.",
      },
      no_laundry: {
        blocks: [
          { time: "Morning", label: "Church + family time", cls: "tag-church" },
          { time: "Afternoon", label: "Full rest - no chores, no reviews", cls: "tag-free" },
          { time: "Evening (optional)", label: "Light reading only", cls: "tag-personal" },
          { time: "11:00 PM", label: "Lights out", cls: "tag-free" },
        ],
        note: "True rest day - no laundry, no chores, no review. Recharge for the week ahead.",
      },
    },
  },
};

// NetAcad Data Analytics Essentials course tracker
const DEFAULT_COURSE = {
  name: "Data Analytics Essentials",
  provider: "Cisco Networking Academy (NetAcad)",
  deadline: "2026-06-30",
  modules: [
    { id: 1, name: "Data Analytic Projects", done: false },
    { id: 2, name: "Data Gathering & Investigation", done: false },
    { id: 3, name: "Preparing & Cleaning Data", done: false },
    { id: 4, name: "Cleaning Data (Advanced)", done: false },
    { id: 5, name: "Data Visualization", done: false },
    { id: 6, name: "SQL & Databases", done: false },
    { id: 7, name: "Tableau & BI Tools", done: false },
  ],
};

// Civil Service Exam subject trackers (percent mastery, 0-100)
const DEFAULT_CSE_SUBJECTS = [
  { id: "math", name: "Numerical / Math", progress: 0 },
  { id: "verbal", name: "Verbal / English", progress: 0 },
  { id: "vocab", name: "Vocabulary", progress: 0 },
  { id: "analogy", name: "Analogy", progress: 0 },
  { id: "logic", name: "Logic / Analytical", progress: 0 },
  { id: "gi", name: "General Information / Constitution", progress: 0 },
  { id: "clerical", name: "Clerical Operations", progress: 0 },
];

// Workout presets for the foldable push-up board
const WORKOUT_PRESETS = {
  heavy: {
    label: "Heavy workout",
    description: "Full push-up board routine - use on no-laundry days.",
    exercises: [
      "Wide-grip push-ups (chest) - 3 x 10-12",
      "Pike push-ups (shoulders) - 3 x 10-12",
      "Diamond push-ups (triceps) - 3 x 8-10",
      "Plank hold (core) - 3 x 30-45 sec",
      "Mountain climbers - 3 x 12 reps",
    ],
  },
  light: {
    label: "Light workout",
    description: "Shorter session - use on light laundry days or rest weeks.",
    exercises: [
      "Wide-grip push-ups - 2 x 8-10",
      "Plank hold - 2 x 30 sec",
      "Shoulder taps - 2 x 10 reps",
      "Stretching - 5 min",
    ],
  },
  recovery: {
    label: "Laundry recovery day",
    description: "Mobility only - use after a heavy handwashing session.",
    exercises: [
      "Shoulder & wrist mobility stretches - 5 min",
      "Cat-cow stretch - 10 reps",
      "Forearm + hand stretches - 5 min",
      "Slow-tempo push-ups (optional) - 1 x 6-8",
    ],
  },
};

// Phase definitions - auto-determined by date
const PHASES = [
  {
    id: "course_phase",
    label: "Course + Review Phase",
    start: "2026-06-15",
    end: "2026-06-30",
    focus: ["NetAcad Course", "Civil Service Review"],
  },
  {
    id: "review_phase",
    label: "Civil Service Heavy Phase",
    start: "2026-07-01",
    end: "2026-08-02",
    focus: ["Civil Service Review", "Workout", "Mock Exams"],
  },
];

const DEFAULT_STATE = {
  schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
  // Per-date overrides: { "2026-06-16": { templateKey: "heavy_laundry", blocks: [...], note: "..." }, ... }
  // If a date has no entry, the day-of-week default (from `schedule`) is used.
  dateSchedules: {},
  course: JSON.parse(JSON.stringify(DEFAULT_COURSE)),
  cseSubjects: JSON.parse(JSON.stringify(DEFAULT_CSE_SUBJECTS)),
  checklist: {
    Mon: [
      { text: "Laundry (handwash)", done: false },
      { text: "Home workout", done: false },
      { text: "Household chores", done: false },
      { text: "Civil service review", done: false },
      { text: "Data analytics module", done: false },
    ],
    Tue: [
      { text: "Home workout", done: false },
      { text: "Household chores", done: false },
      { text: "Civil service review", done: false },
      { text: "Data analytics module", done: false },
    ],
    Wed: [
      { text: "Laundry (handwash)", done: false },
      { text: "Home workout", done: false },
      { text: "Household chores", done: false },
      { text: "Civil service review", done: false },
    ],
    Thu: [
      { text: "Home workout", done: false },
      { text: "Household chores", done: false },
      { text: "Civil service review", done: false },
      { text: "Church duties (evening)", done: false },
    ],
    Fri: [
      { text: "Laundry (handwash)", done: false },
      { text: "Home workout", done: false },
      { text: "Household chores", done: false },
      { text: "Civil service review", done: false },
    ],
    Sat: [
      { text: "Laundry (handwash)", done: false },
      { text: "Home workout", done: false },
      { text: "Household chores", done: false },
      { text: "Mock exam", done: false },
    ],
    Sun: [
      { text: "Church + family time", done: false },
      { text: "Rest", done: false },
    ],
  },
  habits: [
    { name: "Drink 2L water", checks: [false, false, false, false, false, false, false] },
    { name: "6 AM wake up", checks: [false, false, false, false, false, false, false] },
    { name: "Exercise", checks: [false, false, false, false, false, false, false] },
    { name: "Review CSE", checks: [false, false, false, false, false, false, false] },
  ],
  todos: [
    { text: "Finish Module 3 quiz", done: false },
    { text: "Buy groceries", done: false },
    { text: "Review weak areas from mock exam", done: false },
  ],
  reminders: [
    { text: "Civil service exam - August 8", done: false },
    { text: "Course final exam - June 30", done: false },
    { text: "New semester starts - August 3", done: false },
  ],
  // Sleep log: { "Mon": { slept: "11:00 PM", woke: "6:00 AM", quality: 4 }, ... }
  sleepLog: {},
  // Journal entries: { "2026-06-16": { done: "", learned: "", tomorrow: "" }, ... }
  journal: {},
  // Streak tracking
  streak: { count: 0, lastDate: null },
};
