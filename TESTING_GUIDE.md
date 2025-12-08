# 🧪 Testing Guide - Engify Platform v1.0

## ✅ System Ready for Testing!

All features are implemented and ready for comprehensive testing.

## 🚀 Quick Start (2 minutes)

### Terminal 1: Start Backend
```bash
cd backend
npm run start:dev
# Should show: NestJS running on http://localhost:3000
```

### Terminal 2: Start Frontend
```bash
cd frontend
ng serve
# Should show: Application running on http://localhost:4200
```

### Browser: Open Application
```
http://localhost:4200
```

## 🧪 Test Scenarios

### SCENARIO 1: Student Registration & Login
**Time: 3 minutes**

**Steps:**
1. Click "Register" in navbar
2. Select "Student" tab
3. Fill form:
   - Name: `John Student`
   - Email: `student@example.com`
   - Password: `Password123`
   - Confirm: `Password123`
   - Credits: `50`
4. Click "Create Account"
5. Should redirect to login
6. Select "Student" tab
7. Enter credentials
8. Click "Login"
9. Should show Student Dashboard

**Expected Results:**
- ✅ Account created
- ✅ Redirected to login
- ✅ Login succeeds
- ✅ Dashboard shows:
  - Total Credits: 50
  - Available Credits: 50
  - Used Credits: 0

---

### SCENARIO 2: Tutor Registration & Setup
**Time: 5 minutes**

**Steps:**
1. Go to http://localhost:4200/register
2. Select "Tutor" tab
3. Fill form:
   - Name: `Jane Tutor`
   - Email: `tutor@example.com`
   - Password: `Password123`
   - Confirm: `Password123`
   - Degree: `Bachelor's in Mathematics`
4. Click "Create Account"
5. Login as tutor
6. Should see Tutor Dashboard
7. Select a course from dropdown
8. Click "+ Add Slot"
9. Fill availability form:
   - Day: Monday
   - Start: 09:00
   - End: 10:00
   - Capacity: 5
10. Click "Add Availability"

**Expected Results:**
- ✅ Tutor account created
- ✅ Dashboard loads
- ✅ Course dropdown shows courses
- ✅ Availability form appears
- ✅ Slot added successfully
- ✅ Slot appears in list
- ✅ Shows: Monday, 09:00-10:00, 0/5 booked

---

### SCENARIO 3: Browse Courses as Student
**Time: 3 minutes**

**Steps:**
1. Login as student (student@example.com)
2. Click "Courses" in navbar
3. Should see course list
4. Click on "Advanced Mathematics"
5. Should see course details:
   - Course name and code
   - Tutor list (including Jane Tutor)
   - Available time slots

**Expected Results:**
- ✅ Courses load from database
- ✅ Course card shows dynamic data
- ✅ Tutors displayed correctly
- ✅ Availability slots shown
- ✅ Slot shows Monday 09:00-10:00

---

### SCENARIO 4: Book Session with Credits
**Time: 5 minutes**

**Steps:**
1. On course details page
2. See availability slot (Monday 09:00-10:00)
3. Click "Select Slot"
4. Should see booking panel
5. Shows:
   - Tutor: Jane Tutor
   - Day: Monday
   - Time: 09:00 - 10:00
6. Credits to Use: 3
7. Should show:
   - Total: 50
   - Available: 50
8. Click "Confirm Booking"
9. Should see success message
10. Credits should show:
    - Available: 47
    - Should reduce in real-time

**Expected Results:**
- ✅ Slot selection works
- ✅ Booking panel appears
- ✅ Credit input works
- ✅ Credit balance shows
- ✅ Booking succeeds
- ✅ Success message displays
- ✅ Credits updated immediately
- ✅ Slot capacity: 1/5

---

### SCENARIO 5: Insufficient Credits
**Time: 2 minutes**

**Steps:**
1. Login as student with 10 credits
2. Go to course
3. Try to select slot
4. Try credits to use: 15
5. Try to book

**Expected Results:**
- ✅ Warning shown
- ✅ "Insufficient credits" message
- ✅ Button disabled
- ✅ Can't complete booking
- ✅ Reduce to 10, can proceed
- ✅ Booking succeeds

---

### SCENARIO 6: View Student Dashboard
**Time: 2 minutes**

**Steps:**
1. Login as student who booked session
2. Click "Student Dashboard" in navbar
3. View dashboard with:
   - Total Credits: 50
   - Used Credits: 3
   - Available Credits: 47
4. View bookings section
5. Should show booking details:
   - Course name
   - Tutor name
   - Credits used: 3
   - Status

**Expected Results:**
- ✅ Credits display correctly
- ✅ Bookings list populated
- ✅ Booking shows all details
- ✅ Math: 50 - 3 = 47 ✓

---

### SCENARIO 7: View Tutor Dashboard
**Time: 3 minutes**

**Steps:**
1. Login as tutor (tutor@example.com)
2. Should see Tutor Dashboard
3. Select course from dropdown
4. Should show:
   - Availability slots
   - Monday 09:00-10:00: 1/5 booked
5. View "Student Bookings" section
6. Should show student booking:
   - Student: John Student
   - Email: student@example.com
   - Time: (today's date and time)
   - Credits Used: 3

**Expected Results:**
- ✅ Dashboard loads
- ✅ Course selection works
- ✅ Slot shows updated capacity
- ✅ Bookings list shows
- ✅ Student info displayed
- ✅ Booking details correct

---

### SCENARIO 8: Manage Availability
**Time: 3 minutes**

**Steps:**
1. As tutor, view availability
2. Add another slot:
   - Day: Tuesday
   - Time: 14:00-15:00
   - Capacity: 3
3. Add slot
4. Should show 2 slots:
   - Monday: 1/5 booked
   - Tuesday: 0/3 booked
5. Click Delete on Tuesday slot
6. Confirm deletion
7. Should only see Monday slot

**Expected Results:**
- ✅ Multiple slots can be added
- ✅ Each slot independent
- ✅ Delete works correctly
- ✅ Capacity tracked separately

---

### SCENARIO 9: Navigation & Logout
**Time: 2 minutes**

**Steps:**
1. As logged-in student
2. Click on user name in navbar
3. See "Logout" button
4. Click navbar "Student Dashboard"
5. Should navigate to dashboard
6. Click "Logout"
7. Should redirect to login
8. Navbar shows login/register

**Expected Results:**
- ✅ Navigation works
- ✅ Dashboard accessible
- ✅ Logout succeeds
- ✅ Session cleared
- ✅ Redirected to login

---

### SCENARIO 10: Multiple Students Booking Same Slot
**Time: 5 minutes**

**Steps:**
1. Create Student 2: student2@example.com (50 credits)
2. Login as Student 2
3. Go to course > same slot
4. Book with 2 credits
5. See success
6. Check capacity: should be 2/5
7. Switch to Student 1
8. Check: available is now 45
9. Check tutor: shows 2/5 booked

**Expected Results:**
- ✅ Multiple bookings work
- ✅ Capacity increments
- ✅ Each student's credits tracked
- ✅ Tutor sees all bookings

---

## 🧮 Credit System Tests

### Test: Credit Deduction
- Book with X credits → Credits reduce by X ✓

### Test: Transaction History
- Create multiple bookings → Each creates transaction ✓

### Test: Insufficient Funds
- Available < Required → Error, no booking ✓

### Test: Real-time Updates
- Book → Dashboard updates immediately ✓

---

## 🔐 Security Tests

### Test: Password Hashing
- Can't see plain password in database ✓
- Different users have different hashes ✓

### Test: Login Validation
- Wrong password → Error ✓
- Non-existent user → Error ✓

### Test: Type Separation
- Student can only access /students/* ✓
- Tutor can only access /tas/* ✓
- Wrong type in wrong dashboard → Error ✓

---

## 🐛 Error Handling Tests

### Test: Missing Fields
- Try register without name → Error ✓
- Try login without password → Error ✓

### Test: Invalid Data
- Enter negative credits → Rejected ✓
- Enter invalid email → Rejected ✓
- End time before start → Rejected ✓

### Test: Business Logic
- Book when slots full → Error ✓
- Insufficient credits → Error ✓
- Non-existent course → Error ✓

---

## 📊 Database Verification

### Check Student Table
```sql
SELECT id, email, name, "totalCredits", "usedCredits" 
FROM students;
```
Should show:
- john@example.com: 50 total, 3 used, 47 available
- jane@example.com: 50 total, 0 used, 50 available

### Check Credit Transactions
```sql
SELECT * FROM credit_transactions 
ORDER BY "createdAt" DESC;
```
Should show bookings recorded

### Check Availability
```sql
SELECT * FROM ta_availability;
```
Should show slots with updated bookedCount

---

## ✅ Test Summary Template

**Test Date**: _________
**Tester Name**: _________
**Build**: v1.0.0

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Student Registration | ✓ Pass / ✗ Fail | |
| 2. Tutor Setup | ✓ Pass / ✗ Fail | |
| 3. Browse Courses | ✓ Pass / ✗ Fail | |
| 4. Book Session | ✓ Pass / ✗ Fail | |
| 5. Insufficient Credits | ✓ Pass / ✗ Fail | |
| 6. Student Dashboard | ✓ Pass / ✗ Fail | |
| 7. Tutor Dashboard | ✓ Pass / ✗ Fail | |
| 8. Manage Availability | ✓ Pass / ✗ Fail | |
| 9. Navigation/Logout | ✓ Pass / ✗ Fail | |
| 10. Multiple Bookings | ✓ Pass / ✗ Fail | |

**Overall Result**: ✓ PASS / ✗ NEEDS WORK

---

## 📞 Troubleshooting

### Backend won't start
- Check PostgreSQL running
- Check .env file exists
- Run: npm install

### Frontend shows blank
- Check backend running on :3000
- Check network tab for errors
- Clear browser cache

### Login fails
- Check email in database
- Verify password matches
- Check error in network tab

### Booking fails
- Check available credits
- Check slot not full
- Check slot exists
- View browser console

---

## 🎉 When All Tests Pass

Congratulations! Your Engify platform is:
- ✅ Fully functional
- ✅ Ready for deployment
- ✅ Ready for production
- ✅ Ready for users

**Next Steps:**
1. Deploy backend (Docker/Server)
2. Deploy frontend (CDN/Server)
3. Set up production database
4. Configure email notifications
5. Enable payment system

---

**Happy Testing!** 🚀

