// College Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth() || currentUserType !== 'college') {
        window.location.href = 'index.html';
        return;
    }

    initializeCollegeDashboard();
});

// Initialize college dashboard
function initializeCollegeDashboard() {
    loadCollegeData();
    loadRecentActivities();
    loadStudentsList();
    loadFacultyList();
    loadCoursesList();
    loadEventsList();
    loadNotifications();
}

// Load college data into UI
function loadCollegeData() {
    if (!currentUser) return;

    // Update profile information
    document.getElementById('collegeName').textContent = currentUser.name;
    document.getElementById('collegeLocation').textContent = currentUser.location;

    // Use government-appropriate colors for default images
    const defaultCollegeImage = dataManager.getDefaultProfileImage('college', currentUser.name);
    document.getElementById('collegeAvatar').src = defaultCollegeImage;
    document.getElementById('profileImage').src = defaultCollegeImage;
    document.getElementById('profileName').textContent = currentUser.fullName || currentUser.name;
    document.getElementById('profileDescription').textContent = 'Leading Educational Institution';

    // Update form fields
    document.getElementById('institutionName').value = currentUser.fullName || currentUser.name;
    document.getElementById('shortName').value = currentUser.name;
    document.getElementById('institutionEmail').value = currentUser.email;
    document.getElementById('editInstitutionImage').src = defaultCollegeImage;

    // Update stats
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.name);
    const collegeFaculty = dummyData.faculty.filter(f => f.college === currentUser.name);

    document.getElementById('statsStudents').textContent = collegeStudents.length;
    document.getElementById('statsFaculty').textContent = collegeFaculty.length;
    document.getElementById('statsCourses').textContent = currentUser.courses?.length || 0;
    document.getElementById('statsEvents').textContent = currentUser.events?.length || 0;
    document.getElementById('totalStudentsCount').textContent = collegeStudents.length;

    // Update student statistics
    const bTechStudents = collegeStudents.filter(s => s.course.includes('B.Tech')).length;
    const mTechStudents = collegeStudents.filter(s => s.course.includes('M.Tech')).length;
    const avgCGPA = collegeStudents.length > 0 ?
        (collegeStudents.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / collegeStudents.length).toFixed(1) : 0;

    document.getElementById('bTechStudents').textContent = bTechStudents;
    document.getElementById('mTechStudents').textContent = mTechStudents;
    document.getElementById('avgCGPA').textContent = avgCGPA;
    document.getElementById('placementRate').textContent = '85%'; // Dummy data
}

// Load recent activities
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.name);

    const activities = [
        { type: 'student_registration', name: collegeStudents[0]?.name || 'New Student', action: 'registered for admission', time: '2 hours ago', icon: 'user-plus', color: 'primary' },
        { type: 'faculty_join', name: 'Dr. Rajesh Kumar', action: 'joined as faculty member', time: '1 day ago', icon: 'chalkboard-teacher', color: 'success' },
        { type: 'event_created', name: 'Tech Fest 2024', action: 'event was scheduled', time: '2 days ago', icon: 'calendar', color: 'info' },
        { type: 'course_published', name: 'Advanced JavaScript', action: 'course was published', time: '3 days ago', icon: 'book', color: 'warning' },
        { type: 'achievement', name: collegeStudents[1]?.name || 'Student', action: 'won coding competition', time: '1 week ago', icon: 'trophy', color: 'warning' }
    ];

    container.innerHTML = activities.map(activity => `
        <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
            <div class="me-3">
                <div class="rounded-circle bg-${activity.color} bg-opacity-10 p-2">
                    <i class="fas fa-${activity.icon} text-${activity.color}"></i>
                </div>
            </div>
            <div class="flex-grow-1">
                <div class="fw-semibold">${activity.name}</div>
                <div class="text-muted small">${activity.action}</div>
                <div class="text-muted small">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Remove active class from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).style.display = 'block';

    // Add active class to clicked sidebar item
    event.target.classList.add('active');
}

// Load students list
function loadStudentsList() {
    const container = document.getElementById('studentsList');
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.name);

    if (collegeStudents.length === 0) {
        container.innerHTML = '<p class="text-muted">No students found for your institution.</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>CGPA</th>
                        <th>Credits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${collegeStudents.map(student => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${student.profileImage}" alt="${student.name}" class="rounded-circle me-2" style="width: 40px; height: 40px;">
                                    <div>
                                        <div class="fw-semibold">${student.name}</div>
                                        <div class="text-muted small">${student.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${student.course}</td>
                            <td>${student.year}</td>
                            <td>
                                <span class="badge bg-${student.cgpa >= 8 ? 'success' : student.cgpa >= 7 ? 'warning' : 'danger'}">${student.cgpa}</span>
                            </td>
                            <td>
                                <span class="badge bg-info">${student.credits}</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="viewStudentDetails('${student.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Search students
function searchStudents() {
    const searchTerm = document.getElementById('studentSearchInput').value.toLowerCase();
    const collegeStudents = dummyData.students.filter(s =>
        s.college === currentUser.name &&
        (s.name.toLowerCase().includes(searchTerm) ||
            s.course.toLowerCase().includes(searchTerm) ||
            s.email.toLowerCase().includes(searchTerm))
    );

    const container = document.getElementById('studentsList');

    if (collegeStudents.length === 0) {
        container.innerHTML = '<p class="text-muted">No students found matching your search.</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>CGPA</th>
                        <th>Credits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${collegeStudents.map(student => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${student.profileImage}" alt="${student.name}" class="rounded-circle me-2" style="width: 40px; height: 40px;">
                                    <div>
                                        <div class="fw-semibold">${student.name}</div>
                                        <div class="text-muted small">${student.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${student.course}</td>
                            <td>${student.year}</td>
                            <td>
                                <span class="badge bg-${student.cgpa >= 8 ? 'success' : student.cgpa >= 7 ? 'warning' : 'danger'}">${student.cgpa}</span>
                            </td>
                            <td>
                                <span class="badge bg-info">${student.credits}</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="viewStudentDetails('${student.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Load faculty list
function loadFacultyList() {
    const container = document.getElementById('facultyList');
    const collegeFaculty = dummyData.faculty.filter(f => f.college === currentUser.name);

    if (collegeFaculty.length === 0) {
        container.innerHTML = '<p class="text-muted">No faculty members found.</p>';
        return;
    }

    container.innerHTML = collegeFaculty.map(faculty => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="https://via.placeholder.com/60/28a745/white?text=${faculty.name.split(' ').map(n => n[0]).join('')}" alt="${faculty.name}" class="rounded-circle" style="width: 60px; height: 60px;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${faculty.name}</h6>
                        <p class="text-muted mb-1">${faculty.designation}</p>
                        <small class="text-muted">${faculty.department}</small>
                    </div>
                    <div class="col-md-2">
                        <div class="text-center">
                            <div class="fw-bold text-primary">${faculty.experience}</div>
                            <small class="text-muted">Years Experience</small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="text-center">
                            <div class="fw-bold text-success">${faculty.articles?.length || 0}</div>
                            <small class="text-muted">Articles</small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-sm btn-outline-success" onclick="viewFacultyDetails('${faculty.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Search faculty
function searchFaculty() {
    const searchTerm = document.getElementById('facultySearchInput').value.toLowerCase();
    const collegeFaculty = dummyData.faculty.filter(f =>
        f.college === currentUser.name &&
        (f.name.toLowerCase().includes(searchTerm) ||
            f.department.toLowerCase().includes(searchTerm) ||
            f.designation.toLowerCase().includes(searchTerm))
    );

    const container = document.getElementById('facultyList');

    if (collegeFaculty.length === 0) {
        container.innerHTML = '<p class="text-muted">No faculty found matching your search.</p>';
        return;
    }

    container.innerHTML = collegeFaculty.map(faculty => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="https://via.placeholder.com/60/28a745/white?text=${faculty.name.split(' ').map(n => n[0]).join('')}" alt="${faculty.name}" class="rounded-circle" style="width: 60px; height: 60px;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${faculty.name}</h6>
                        <p class="text-muted mb-1">${faculty.designation}</p>
                        <small class="text-muted">${faculty.department}</small>
                    </div>
                    <div class="col-md-2">
                        <div class="text-center">
                            <div class="fw-bold text-primary">${faculty.experience}</div>
                            <small class="text-muted">Years Experience</small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="text-center">
                            <div class="fw-bold text-success">${faculty.articles?.length || 0}</div>
                            <small class="text-muted">Articles</small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-sm btn-outline-success" onclick="viewFacultyDetails('${faculty.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load courses list
function loadCoursesList() {
    const container = document.getElementById('coursesList');
    const courses = currentUser.courses || [];

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-book fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No courses published yet</h6>
                <p class="text-muted">Create learning courses for your students</p>
                <button class="btn btn-warning" onclick="addCourse()">
                    <i class="fas fa-plus me-1"></i>Add Your First Course
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map((course, index) => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title">${course.title}</h6>
                        <p class="card-text">${course.description}</p>
                        ${course.youtubeLink ? `
                            <a href="${course.youtubeLink}" target="_blank" class="btn btn-sm btn-outline-danger">
                                <i class="fab fa-youtube me-1"></i>Watch on YouTube
                            </a>
                        ` : ''}
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editCourse(${index})">
                                <i class="fas fa-edit me-2"></i>Edit
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="deleteCourse(${index})">
                                <i class="fas fa-trash me-2"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load events list
function loadEventsList() {
    const container = document.getElementById('eventsList');
    const events = currentUser.events || [];

    if (events.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-calendar fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No events scheduled</h6>
                <p class="text-muted">Create and manage institutional events</p>
                <button class="btn btn-info" onclick="addEvent()">
                    <i class="fas fa-plus me-1"></i>Create Your First Event
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map((event, index) => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title">
                            ${event.title}
                            <span class="badge bg-info ms-2">${event.type || 'Event'}</span>
                        </h6>
                        <p class="card-text">${event.description}</p>
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>${formatDate(event.date)}
                            ${event.time ? `<i class="fas fa-clock ms-2 me-1"></i>${event.time}` : ''}
                        </small>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editEvent(${index})">
                                <i class="fas fa-edit me-2"></i>Edit
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="deleteEvent(${index})">
                                <i class="fas fa-trash me-2"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load notifications
function loadNotifications() {
    const container = document.getElementById('notificationsList');

    // Get faculty verification notifications from localStorage
    const facultyNotifications = JSON.parse(localStorage.getItem('collegeNotifications') || '[]');

    const defaultNotifications = [
        {
            id: 'default1',
            title: 'Faculty Profile Verification',
            message: 'Dr. Rajesh Kumar verified Arjun Sharma\'s profile and agreed his new achievement record',
            time: '1 hour ago',
            type: 'success',
            icon: 'user-check',
            faculty: 'Dr. Rajesh Kumar',
            student: 'Arjun Sharma'
        },
        {
            id: 'default2',
            title: 'Faculty Profile Verification',
            message: 'Dr. Rajesh Kumar verified Priya Reddy\'s profile and agreed her new internship record',
            time: '3 hours ago',
            type: 'success',
            icon: 'certificate',
            faculty: 'Dr. Rajesh Kumar',
            student: 'Priya Reddy'
        },
        {
            id: 'default3',
            title: 'NAAC Accreditation Due',
            message: 'NAAC re-accreditation documentation needs to be prepared',
            time: '2 days ago',
            type: 'warning',
            icon: 'exclamation-triangle'
        },
        {
            id: 'default4',
            title: 'New Faculty Registration',
            message: 'Dr. Rajesh Kumar has registered as faculty member',
            time: '1 week ago',
            type: 'info',
            icon: 'user-plus'
        },
        {
            id: 'default5',
            title: 'Student Achievement',
            message: '50+ students participated in coding competition',
            time: '2 weeks ago',
            type: 'info',
            icon: 'trophy'
        }
    ];

    // Combine faculty notifications with default ones
    const allNotifications = [
        ...facultyNotifications.map(fn => ({
            id: fn.id,
            title: 'Faculty Profile Verification',
            message: fn.message,
            time: fn.time,
            type: fn.action === 'approved' ? 'success' : 'warning',
            icon: fn.action === 'approved' ? 'user-check' : 'user-times',
            faculty: fn.facultyName,
            student: fn.studentName,
            isDismissible: true
        })),
        ...defaultNotifications
    ];

    container.innerHTML = allNotifications.map(notification => `
        <div class="card mb-3 notification-card" data-id="${notification.id}">
            <div class="card-body">
                <div class="d-flex align-items-start">
                    <div class="me-3">
                        <div class="rounded-circle bg-${notification.type} bg-opacity-10 p-2">
                            <i class="fas fa-${notification.icon} text-${notification.type}"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${notification.title}</h6>
                        <p class="text-muted mb-1">${notification.message}</p>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>${notification.time}
                            ${notification.faculty ? `<span class="ms-2"><i class="fas fa-chalkboard-teacher me-1"></i>${notification.faculty}</span>` : ''}
                            ${notification.student ? `<span class="ms-2"><i class="fas fa-user-graduate me-1"></i>${notification.student}</span>` : ''}
                        </small>
                    </div>
                    ${notification.isDismissible ? `
                    <div class="ms-2">
                        <button class="btn btn-light btn-sm" onclick="dismissCollegeNotification('${notification.id}')" title="Dismiss Notification">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Dismiss college notification
function dismissCollegeNotification(notificationId) {
    const notificationCard = document.querySelector(`[data-id="${notificationId}"]`);

    // Remove with animation
    notificationCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notificationCard.style.opacity = '0';
    notificationCard.style.transform = 'translateX(100%)';

    setTimeout(() => {
        notificationCard.remove();
    }, 300);

    // Remove from localStorage
    const collegeNotifications = JSON.parse(localStorage.getItem('collegeNotifications') || '[]');
    const updatedNotifications = collegeNotifications.filter(n => n.id != notificationId);
    localStorage.setItem('collegeNotifications', JSON.stringify(updatedNotifications));

    showToast('Notification dismissed', 'info');
}

// Modal functions
function addCourse() {
    const modal = new bootstrap.Modal(document.getElementById('addCourseModal'));
    modal.show();
}

function addEvent() {
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    modal.show();
}

// Save course
function saveCourse() {
    const title = document.getElementById('courseTitle').value;
    const description = document.getElementById('courseDescription').value;
    const youtubeLink = document.getElementById('courseYouTubeLink').value;
    const duration = document.getElementById('courseDuration').value;
    const level = document.getElementById('courseLevel').value;

    if (!title || !description) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }

    const newCourse = {
        title,
        description,
        youtubeLink,
        duration: parseInt(duration),
        level,
        createdDate: new Date().toISOString().split('T')[0]
    };

    // Add to college courses
    if (!currentUser.courses) currentUser.courses = [];
    currentUser.courses.push(newCourse);

    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Reset form
    document.getElementById('courseForm').reset();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();

    // Show success message
    showToast('Course added successfully!', 'success');

    // Update stats and refresh list
    document.getElementById('statsCourses').textContent = currentUser.courses.length;
    loadCoursesList();
}

// Save event
function saveEvent() {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const type = document.getElementById('eventType').value;

    if (!title || !description || !date) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }

    const newEvent = {
        title,
        description,
        date,
        time,
        type,
        createdDate: new Date().toISOString().split('T')[0]
    };

    // Add to college events
    if (!currentUser.events) currentUser.events = [];
    currentUser.events.push(newEvent);

    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Reset form
    document.getElementById('eventForm').reset();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();

    // Show success message
    showToast('Event created successfully!', 'success');

    // Update stats and refresh list
    document.getElementById('statsEvents').textContent = currentUser.events.length;
    loadEventsList();
}

// Delete functions
function deleteCourse(index) {
    if (confirm('Are you sure you want to delete this course?')) {
        currentUser.courses.splice(index, 1);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadCoursesList();
        document.getElementById('statsCourses').textContent = currentUser.courses.length;
        showToast('Course deleted successfully!', 'success');
    }
}

function deleteEvent(index) {
    if (confirm('Are you sure you want to delete this event?')) {
        currentUser.events.splice(index, 1);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadEventsList();
        document.getElementById('statsEvents').textContent = currentUser.events.length;
        showToast('Event deleted successfully!', 'success');
    }
}

// View details functions
function viewStudentDetails(studentId) {
    const student = dummyData.students.find(s => s.id == studentId);
    if (student) {
        alert(`Student Details:\nName: ${student.name}\nCourse: ${student.course}\nCGPA: ${student.cgpa}\nCredits: ${student.credits}`);
    }
}

function viewFacultyDetails(facultyId) {
    const faculty = dummyData.faculty.find(f => f.id == facultyId);
    if (faculty) {
        alert(`Faculty Details:\nName: ${faculty.name}\nDesignation: ${faculty.designation}\nDepartment: ${faculty.department}\nExperience: ${faculty.experience} years`);
    }
}

// Report generation functions
function generateReport() {
    showToast('Generating comprehensive institutional report...', 'info');
}

function generateStudentReport() {
    showToast('Generating student performance report...', 'info');
}

function generateAcademicReport() {
    showToast('Generating academic performance report...', 'info');
}

function generateNAACReport() {
    showToast('Generating NAAC accreditation report...', 'info');
}

function generatePlacementReport() {
    showToast('Generating placement statistics report...', 'info');
}

function exportStudentReport() {
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.name);
    const csvData = [
        ['Name', 'Course', 'Year', 'CGPA', 'Email', 'Credits', 'Phone'],
        ...collegeStudents.map(student => [
            student.name,
            student.course,
            student.year,
            student.cgpa,
            student.email,
            student.credits,
            student.phone
        ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.name}_students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast('Student data exported successfully!', 'success');
}

// Profile editing
function editInstitutionProfile() {
    const form = document.getElementById('institutionProfileForm');
    const inputs = form.querySelectorAll('input:not([readonly]), textarea');
    inputs.forEach(input => input.disabled = false);
}

function cancelInstitutionEdit() {
    loadCollegeData();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type) {
    // Create toast notification
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'} border-0 position-fixed" 
             style="top: 20px; right: 20px; z-index: 1055;" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toast = new bootstrap.Toast(document.querySelector('.toast:last-child'));
    toast.show();

    // Remove toast element after it's hidden
    setTimeout(() => {
        const toastElement = document.querySelector('.toast:last-child');
        if (toastElement) toastElement.remove();
    }, 5000);
}