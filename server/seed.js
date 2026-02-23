const { connectDb, closeDb } = require("./src/config/db");
const { getCollection: getUserCollection, createUser } = require("./src/models/User.model");
const { getCollection: getTeacherCollection } = require("./src/models/Teacher.model");
const { getCollection: getClassCollection } = require("./src/models/Class.model");
const { getCollection: getStudentCollection } = require("./src/models/Student.model");
const { getCollection: getFeeCollection } = require("./src/models/Fee.model");
const { getCollection: getTransportCollection } = require("./src/models/Transport.model");
const { getCollection: getLibraryCollection } = require("./src/models/Library.model");
const { getCollection: getHealthDisciplineCollection } = require("./src/models/HealthDiscipline.model");
const { getCollection: getAnnouncementCollection } = require("./src/models/Announcement.model");
const { getCollection: getNotificationCollection } = require("./src/models/Notification.model");

const seedDatabase = async () => {
  try {
    await connectDb();

    const users = getUserCollection();
    const teachers = getTeacherCollection();
    const classes = getClassCollection();
    const students = getStudentCollection();

    await Promise.all([
      users.deleteMany({}),
      teachers.deleteMany({}),
      classes.deleteMany({}),
      students.deleteMany({}),
      getFeeCollection().deleteMany({}),
      getTransportCollection().deleteMany({}),
      getLibraryCollection().deleteMany({}),
      getHealthDisciplineCollection().deleteMany({}),
      getAnnouncementCollection().deleteMany({}),
      getNotificationCollection().deleteMany({})
    ]);
    // Seed Fees
    await getFeeCollection().insertMany([
      {
        studentEmail: "raj.kumar@student.com",
        amount: 1500,
        status: "paid",
        dueDate: new Date(),
        paidDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentEmail: "priya.sharma@student.com",
        amount: 1500,
        status: "unpaid",
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed Transport
    await getTransportCollection().insertMany([
      {
        routeName: "Route 1",
        busNumber: "KA01AB1234",
        driverName: "Suresh Kumar",
        students: ["raj.kumar@student.com", "priya.sharma@student.com"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed Library
    await getLibraryCollection().insertMany([
      {
        bookTitle: "Mathematics for Class 10",
        author: "R. S. Aggarwal",
        issuedTo: "raj.kumar@student.com",
        issueDate: new Date(),
        returnDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookTitle: "Physics Fundamentals",
        author: "H. C. Verma",
        issuedTo: "priya.sharma@student.com",
        issueDate: new Date(),
        returnDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed Health/Discipline
    await getHealthDisciplineCollection().insertMany([
      {
        studentEmail: "raj.kumar@student.com",
        healthRecord: "Vaccinated",
        disciplineRecord: "No issues",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentEmail: "priya.sharma@student.com",
        healthRecord: "Asthma",
        disciplineRecord: "Late submission",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed Announcements
    await getAnnouncementCollection().insertMany([
      {
        title: "School Reopens",
        message: "School will reopen on March 1st.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed Notifications
    await getNotificationCollection().insertMany([
      {
        recipientEmail: "raj.kumar@student.com",
        message: "Fee payment received.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        recipientEmail: "priya.sharma@student.com",
        message: "Library book due soon.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Use environment variables or generate random strong passwords for seeded users
    const crypto = require('crypto');
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64');
    const adminUser = await createUser({
      name: "Admin User",
      email: process.env.SEED_ADMIN_EMAIL || "admin@school.com",
      password: adminPassword,
      role: "admin"
    });

    const teacher1 = {
      name: "Mr. John Smith",
      email: "john.smith@school.com",
      employeeId: "T001",
      department: "Science",
      subjects: ["Physics", "Chemistry"],
      phone: "9876543210",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const teacher2 = {
      name: "Ms. Sarah Johnson",
      email: "sarah.johnson@school.com",
      employeeId: "T002",
      department: "Mathematics",
      subjects: ["Math", "Statistics"],
      phone: "9876543211",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const teacherInsertResult = await teachers.insertMany([teacher1, teacher2]);
    const teacherIds = Object.values(teacherInsertResult.insertedIds);

    const class10A = {
      name: "Class 10",
      section: "A",
      year: 2025,
      classTeacher: teacherIds[0],
      capacity: 40,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const class10B = {
      name: "Class 10",
      section: "B",
      year: 2025,
      classTeacher: teacherIds[1],
      capacity: 35,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const classInsertResult = await classes.insertMany([class10A, class10B]);
    const classIds = Object.values(classInsertResult.insertedIds);

    await students.insertMany([
      {
        name: "Raj Kumar",
        email: "raj.kumar@student.com",
        rollNumber: "10A001",
        class: classIds[0],
        guardianName: "Mr. Kumar",
        guardianPhone: "9876543200",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@student.com",
        rollNumber: "10A002",
        class: classIds[0],
        guardianName: "Mrs. Sharma",
        guardianPhone: "9876543201",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Arjun Singh",
        email: "arjun.singh@student.com",
        rollNumber: "10B001",
        class: classIds[1],
        guardianName: "Mr. Singh",
        guardianPhone: "9876543202",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const teacherPassword = process.env.SEED_TEACHER_PASSWORD || crypto.randomBytes(12).toString('base64');
    const teacherUser = await createUser({
      name: "Mr. John Smith",
      email: process.env.SEED_TEACHER_EMAIL || "teacher@school.com",
      password: teacherPassword,
      role: "teacher"
    });

    const studentPassword = process.env.SEED_STUDENT_PASSWORD || crypto.randomBytes(12).toString('base64');
    const studentUser = await createUser({
      name: "Raj Kumar",
      email: process.env.SEED_STUDENT_EMAIL || "student@school.com",
      password: studentPassword,
      role: "student"
    });

    console.log("\n✅ Database seeded successfully!\n");
    console.log("✓ Created admin:", adminUser.email);
    console.log("✓ Created teacher user:", teacherUser.email);
    console.log("✓ Created student user:", studentUser.email);
    if (process.env.NODE_ENV !== 'production') {
      console.log("\n📝 Test Credentials (development only):");
      console.log(`  Admin: ${adminUser.email} / ${adminPassword}`);
      console.log(`  Teacher: ${teacherUser.email} / ${teacherPassword}`);
      console.log(`  Student: ${studentUser.email} / ${studentPassword}`);
    }
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
};

seedDatabase();
