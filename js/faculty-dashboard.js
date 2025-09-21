// Faculty Dashboard JavaScript

let selectedStudent = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth() || currentUserType !== 'faculty') {
        window.location.href = 'index.html';
        return;
    }

    initializeFacultyDashboard();
});

// Initialize faculty dashboard
function initializeFacultyDashboard() {
    loadFacultyData();
    loadRecentActivities();
    loadStudentsList();
    loadFacultyArticles();
    loadNotifications();
}

// Load faculty data into UI
function loadFacultyData() {
    if (!currentUser) return;

    // Use default image system for faculty
    const facultyImage = currentUser.profileImage && !currentUser.profileImage.includes('via.placeholder.com')
        ? currentUser.profileImage
        : (typeof dataManager !== 'undefined'
            ? dataManager.getDefaultProfileImage('faculty', currentUser.name)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2d5016&color=fff&size=150&bold=true`);

    // Update profile information
    document.getElementById('facultyName').textContent = currentUser.name;
    document.getElementById('facultyDesignation').textContent = `${currentUser.designation}, ${currentUser.department}`;
    document.getElementById('facultyCollege').textContent = currentUser.college;
    document.getElementById('facultyAvatar').src = facultyImage;
    document.getElementById('profileImage').src = facultyImage;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileDesignation').textContent = `${currentUser.designation}, ${currentUser.department}`;
    document.getElementById('experienceYears').textContent = currentUser.experience;

    // Update form fields
    document.getElementById('facultyFullName').value = currentUser.name;
    document.getElementById('facultyDesignationInput').value = currentUser.designation;
    document.getElementById('facultyDepartment').value = currentUser.department;
    document.getElementById('facultyEmail').value = currentUser.email;
    document.getElementById('facultyExperience').value = currentUser.experience;
    document.getElementById('editFacultyImage').src = `https://via.placeholder.com/150/28a745/white?text=${currentUser.name.split(' ').map(n => n[0]).join('')}`;

    // Update stats
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.college);
    document.getElementById('totalStudents').textContent = collegeStudents.length;
    document.getElementById('totalArticles').textContent = currentUser.articles?.length || 0;
    document.getElementById('creditsGiven').textContent = Math.floor(Math.random() * 20) + 5; // Dummy data
}

// Load recent activities
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.college);

    const activities = [
        { student: collegeStudents[0]?.name || 'Student A', action: 'uploaded new certificate', time: '2 hours ago', icon: 'certificate', color: 'success' },
        { student: collegeStudents[1]?.name || 'Student B', action: 'added internship experience', time: '5 hours ago', icon: 'briefcase', color: 'info' },
        { student: collegeStudents[0]?.name || 'Student A', action: 'completed project milestone', time: '1 day ago', icon: 'trophy', color: 'warning' },
    ];

    container.innerHTML = activities.map(activity => `
        <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
            <div class="me-3">
                <div class="rounded-circle bg-${activity.color} bg-opacity-10 p-2">
                    <i class="fas fa-${activity.icon} text-${activity.color}"></i>
                </div>
            </div>
            <div class="flex-grow-1">
                <div class="fw-semibold">${activity.student}</div>
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
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.college);

    if (collegeStudents.length === 0) {
        container.innerHTML = '<p class="text-muted">No students found for your college.</p>';
        return;
    }

    container.innerHTML = collegeStudents.map(student => `
        <div class="student-card">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${student.profileImage}" alt="${student.name}" class="student-avatar">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-1">${student.name}</h6>
                    <p class="text-muted mb-1">${student.course} - ${student.year}</p>
                    <small class="text-muted">${student.email}</small>
                </div>
                <div class="col-md-2">
                    <div class="text-center">
                        <div class="fw-bold text-primary">${student.cgpa}</div>
                        <small class="text-muted">CGPA</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="text-center">
                        <div class="fw-bold text-success">${student.credits}</div>
                        <small class="text-muted">Credits</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewStudentProfile('${student.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="editStudentRecord('${student.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Search students
function searchStudents() {
    const searchTerm = document.getElementById('studentSearchInput').value.toLowerCase();
    const collegeStudents = dummyData.students.filter(s =>
        s.college === currentUser.college &&
        (s.name.toLowerCase().includes(searchTerm) ||
            s.course.toLowerCase().includes(searchTerm) ||
            s.email.toLowerCase().includes(searchTerm))
    );

    const container = document.getElementById('studentsList');

    if (collegeStudents.length === 0) {
        container.innerHTML = '<p class="text-muted">No students found matching your search.</p>';
        return;
    }

    container.innerHTML = collegeStudents.map(student => `
        <div class="student-card">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${student.profileImage}" alt="${student.name}" class="student-avatar">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-1">${student.name}</h6>
                    <p class="text-muted mb-1">${student.course} - ${student.year}</p>
                    <small class="text-muted">${student.email}</small>
                </div>
                <div class="col-md-2">
                    <div class="text-center">
                        <div class="fw-bold text-primary">${student.cgpa}</div>
                        <small class="text-muted">CGPA</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="text-center">
                        <div class="fw-bold text-success">${student.credits}</div>
                        <small class="text-muted">Credits</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewStudentProfile('${student.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="editStudentRecord('${student.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// View student profile
function viewStudentProfile(studentId) {
    const student = dummyData.students.find(s => s.id == studentId);
    if (!student) return;

    selectedStudent = student;

    const modalContent = document.getElementById('studentDetailContent');
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-4 text-center">
                <img src="${student.profileImage}" alt="${student.name}" class="profile-avatar mb-3">
                <h5>${student.name}</h5>
                <p class="text-muted">${student.headline}</p>
                <div class="credit-badge">
                    <i class="fas fa-star me-1"></i>${student.credits} Credits
                </div>
            </div>
            <div class="col-md-8">
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Course:</strong> ${student.course}
                    </div>
                    <div class="col-6">
                        <strong>Year:</strong> ${student.year}
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>CGPA:</strong> ${student.cgpa}
                    </div>
                    <div class="col-6">
                        <strong>Phone:</strong> ${student.phone}
                    </div>
                </div>
                <div class="mb-3">
                    <strong>Email:</strong> ${student.email}
                </div>
                <div class="mb-3">
                    <strong>Bio:</strong> ${student.bio}
                </div>
                <div class="mb-3">
                    <strong>Skills:</strong><br>
                    ${student.skills.map(skill => `<span class="skill-tag me-1 mb-1">${skill}</span>`).join('')}
                </div>
                <div class="mb-3">
                    <strong>Achievements:</strong> ${student.achievements.length}
                </div>
                <div class="mb-3">
                    <strong>Certificates:</strong> ${student.certificates.length}
                </div>
                <div class="mb-3">
                    <strong>Internships:</strong> ${student.internships.length}
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('studentDetailModal'));
    modal.show();
}

// Edit student record
function editStudentRecord(studentId) {
    const student = dummyData.students.find(s => s.id == studentId);
    if (!student) return;

    // Create edit form modal
    const editForm = `
        <div class="modal fade" id="editStudentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Student Record</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            You can only edit CGPA and attendance records.
                        </div>
                        <form id="editStudentForm">
                            <div class="mb-3">
                                <label class="form-label">Student Name</label>
                                <input type="text" class="form-control" value="${student.name}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Current CGPA</label>
                                <input type="number" class="form-control" id="editCGPA" value="${student.cgpa}" step="0.1" min="0" max="10">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Attendance Percentage</label>
                                <input type="number" class="form-control" id="editAttendance" value="92" min="0" max="100">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Comments (Optional)</label>
                                <textarea class="form-control" id="editComments" rows="3" placeholder="Add any comments about the student's performance..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveStudentRecord('${student.id}')">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('editStudentModal');
    if (existingModal) existingModal.remove();

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', editForm);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    modal.show();
}

// Save student record
function saveStudentRecord(studentId) {
    const cgpa = document.getElementById('editCGPA').value;
    const attendance = document.getElementById('editAttendance').value;
    const comments = document.getElementById('editComments').value;

    // Update student data
    const student = dummyData.students.find(s => s.id == studentId);
    if (student) {
        student.cgpa = parseFloat(cgpa);

        // In a real application, this would save to database
        showToast('Student record updated successfully!', 'success');

        // Refresh students list
        loadStudentsList();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('editStudentModal')).hide();
    }
}

// Give credit to student
function giveCredit() {
    if (!selectedStudent) return;

    selectedStudent.credits += 1;
    showToast(`Credit given to ${selectedStudent.name}! New credit total: ${selectedStudent.credits}`, 'success');

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('studentDetailModal')).hide();

    // Refresh students list
    loadStudentsList();
}

// Load faculty articles
function loadFacultyArticles() {
    const container = document.getElementById('facultyArticlesList');
    const articles = currentUser.articles || [];

    if (articles.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No articles published yet</h6>
                <p class="text-muted">Share your knowledge with students</p>
                <button class="btn btn-success" onclick="showSection('publish')">
                    <i class="fas fa-pen me-1"></i>Write Your First Article
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = articles.map((article, index) => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title">${article.title}</h6>
                        <p class="card-text">${article.content.substring(0, 200)}...</p>
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>Published on ${formatDate(article.date)}
                        </small>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editArticle(${index})">
                                <i class="fas fa-edit me-2"></i>Edit
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="deleteArticle(${index})">
                                <i class="fas fa-trash me-2"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle article form submission
document.addEventListener('DOMContentLoaded', function () {
    const articleForm = document.getElementById('articleForm');
    if (articleForm) {
        articleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            publishArticle();
        });
    }
});

// Publish article
function publishArticle() {
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
    const tags = document.getElementById('articleTags').value;
    const category = document.getElementById('articleCategory').value;
    const readingTime = document.getElementById('readingTime').value;

    if (!title || !content) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }

    const newArticle = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        category,
        readingTime: parseInt(readingTime),
        date: new Date().toISOString().split('T')[0],
        author: currentUser.name
    };

    // Add to faculty articles
    if (!currentUser.articles) currentUser.articles = [];
    currentUser.articles.push(newArticle);

    // Add to global articles for students to read
    if (!dummyData.faculty[0].articles) dummyData.faculty[0].articles = [];
    dummyData.faculty[0].articles.push(newArticle);

    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Reset form
    document.getElementById('articleForm').reset();

    // Show success message
    showToast('Article published successfully!', 'success');

    // Update stats
    document.getElementById('totalArticles').textContent = currentUser.articles.length;

    // Refresh articles list
    loadFacultyArticles();

    // Switch to articles view
    showSection('articles');
}

// Load notifications
function loadNotifications() {
    const container = document.getElementById('notificationsList');

    const notifications = [
        {
            id: 1,
            title: 'Student Profile Verification Request',
            message: 'Arjun Sharma has requested profile verification for new achievement record',
            time: '2 hours ago',
            type: 'info',
            icon: 'user-check',
            status: 'pending',
            student: 'Arjun Sharma'
        },
        {
            id: 2,
            title: 'Event Record Approval',
            message: 'Priya Reddy submitted new internship completion record for verification',
            time: '4 hours ago',
            type: 'warning',
            icon: 'calendar-check',
            status: 'pending',
            student: 'Priya Reddy'
        },
        {
            id: 3,
            title: 'Certificate Validation Request',
            message: 'Rahul Kumar uploaded AWS certification for faculty approval',
            time: '1 day ago',
            type: 'info',
            icon: 'certificate',
            status: 'pending',
            student: 'Rahul Kumar'
        },
        {
            id: 4,
            title: 'Achievement Verification',
            message: 'Sneha Patel\'s hackathon achievement needs faculty confirmation',
            time: '1 day ago',
            type: 'success',
            icon: 'trophy',
            status: 'approved',
            student: 'Sneha Patel'
        },
        {
            id: 5,
            title: 'Project Submission Review',
            message: 'Final year project submission from Vikram Singh requires review',
            time: '2 days ago',
            type: 'warning',
            icon: 'file-alt',
            status: 'pending',
            student: 'Vikram Singh'
        }
    ];

    container.innerHTML = notifications.map(notification => `
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
                            ${notification.student ? `<span class="ms-2"><i class="fas fa-user me-1"></i>${notification.student}</span>` : ''}
                        </small>
                        ${notification.status === 'pending' ? `
                        <div class="mt-2">
                            <button class="btn btn-success btn-sm me-2" onclick="handleNotificationAction(${notification.id}, 'approve')" title="Approve Request">
                                <i class="fas fa-check me-1"></i>Approve
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="handleNotificationAction(${notification.id}, 'decline')" title="Decline Request">
                                <i class="fas fa-times me-1"></i>Decline
                            </button>
                        </div>
                        ` : `
                        <div class="mt-2">
                            <span class="badge bg-success">
                                <i class="fas fa-check me-1"></i>Approved
                            </span>
                        </div>
                        `}
                    </div>
                    <div class="ms-2">
                        <button class="btn btn-light btn-sm" onclick="dismissNotification(${notification.id})" title="Dismiss Notification">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle notification actions (approve/decline)
function handleNotificationAction(notificationId, action) {
    const notificationCard = document.querySelector(`[data-id="${notificationId}"]`);
    const studentName = notificationCard.querySelector('.text-muted .fa-user').nextElementSibling.textContent.trim();

    if (action === 'approve') {
        // Update UI to show approved status
        const actionDiv = notificationCard.querySelector('.mt-2');
        actionDiv.innerHTML = `
            <span class="badge bg-success">
                <i class="fas fa-check me-1"></i>Approved
            </span>
        `;

        // Show success message
        showToast(`Request approved successfully! ${studentName}'s record has been verified.`, 'success');

        // Simulate adding notification to college dashboard
        addCollegeNotification(currentUser.name, studentName, 'approved');

    } else if (action === 'decline') {
        // Remove the notification card with animation
        notificationCard.style.transition = 'opacity 0.3s ease';
        notificationCard.style.opacity = '0';

        setTimeout(() => {
            notificationCard.remove();
        }, 300);

        // Show decline message
        showToast(`Request declined. ${studentName} has been notified.`, 'warning');

        // Simulate adding notification to college dashboard
        addCollegeNotification(currentUser.name, studentName, 'declined');
    }
}

// Dismiss notification
function dismissNotification(notificationId) {
    const notificationCard = document.querySelector(`[data-id="${notificationId}"]`);

    // Remove with animation
    notificationCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notificationCard.style.opacity = '0';
    notificationCard.style.transform = 'translateX(100%)';

    setTimeout(() => {
        notificationCard.remove();
    }, 300);

    showToast('Notification dismissed', 'info');
}

// Add notification to college dashboard (simulated)
function addCollegeNotification(facultyName, studentName, action) {
    const collegeNotifications = JSON.parse(localStorage.getItem('collegeNotifications') || '[]');

    collegeNotifications.push({
        id: Date.now(),
        facultyName: facultyName,
        studentName: studentName,
        action: action,
        message: `${facultyName} ${action} ${studentName}'s profile and ${action === 'approved' ? 'agreed to' : 'declined'} their new event record`,
        timestamp: new Date().toISOString(),
        time: 'Just now'
    });

    localStorage.setItem('collegeNotifications', JSON.stringify(collegeNotifications));
}

// Faculty profile editing
function editFacultyProfile() {
    const form = document.getElementById('facultyProfileForm');
    const inputs = form.querySelectorAll('input:not([readonly])');
    inputs.forEach(input => input.disabled = false);
}

function cancelFacultyEdit() {
    loadFacultyData();
}

// Export student data
function exportStudentData() {
    const collegeStudents = dummyData.students.filter(s => s.college === currentUser.college);
    const csvData = [
        ['Name', 'Course', 'Year', 'CGPA', 'Email', 'Credits'],
        ...collegeStudents.map(student => [
            student.name,
            student.course,
            student.year,
            student.cgpa,
            student.email,
            student.credits
        ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.college}_students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast('Student data exported successfully!', 'success');
}

// Article management
function editArticle(index) {
    const article = currentUser.articles[index];
    document.getElementById('articleTitle').value = article.title;
    document.getElementById('articleContent').value = article.content;
    document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
    document.getElementById('articleCategory').value = article.category || 'technology';
    document.getElementById('readingTime').value = article.readingTime || 5;

    showSection('publish');
    showToast('Article loaded for editing', 'info');
}

function deleteArticle(index) {
    if (confirm('Are you sure you want to delete this article?')) {
        currentUser.articles.splice(index, 1);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadFacultyArticles();
        document.getElementById('totalArticles').textContent = currentUser.articles.length;
        showToast('Article deleted successfully!', 'success');
    }
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