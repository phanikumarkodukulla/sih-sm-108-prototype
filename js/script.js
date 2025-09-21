// Smart Student Hub - Main JavaScript File

// Initialize AOS Animation
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Global Variables
let currentUser = null;
let currentUserType = null;

// Dummy Data
const dummyData = {
    students: [
        {
            id: 1,
            name: "Arjun Sharma",
            email: "arjun.sharma@student.anits.edu.in",
            college: "ANITS",
            course: "B.Tech CSE",
            year: "3rd Year",
            cgpa: 8.5,
            skills: ["JavaScript", "Python", "React", "Machine Learning"],
            achievements: [
                { title: "Hackathon Winner", description: "Won Smart India Hackathon 2024", date: "2024-03-15" },
                { title: "Research Paper", description: "Published in IEEE Conference", date: "2024-02-20" }
            ],
            certificates: [
                { title: "AWS Certified", organization: "Amazon", date: "2024-01-15", id: "AWS-123456" },
                { title: "Google Cloud Professional", organization: "Google", date: "2023-12-10", id: "GCP-789012" }
            ],
            internships: [
                { company: "Microsoft", role: "SDE Intern", duration: "3 months", description: "Worked on Azure services" }
            ],
            profileImage: "https://ui-avatars.com/api/?name=Arjun+Sharma&background=007bff&color=fff&size=150&bold=true",
            headline: "Aspiring Software Engineer | AI Enthusiast",
            bio: "Passionate about technology and innovation. Love to solve complex problems.",
            credits: 45,
            fatherName: "Raj Sharma",
            motherName: "Priya Sharma",
            phone: "+91 9876543210",
            socialMedia: {
                linkedin: "https://linkedin.com/in/arjunsharma",
                github: "https://github.com/arjunsharma",
                portfolio: "https://arjunsharma.dev"
            }
        },
        {
            id: 2,
            name: "Priya Reddy",
            email: "priya.reddy@student.anits.edu.in",
            college: "ANITS",
            course: "B.Tech ECE",
            year: "4th Year",
            cgpa: 9.2,
            skills: ["VLSI Design", "Python", "MATLAB", "IoT"],
            achievements: [
                { title: "Best Project Award", description: "IoT based Smart Home System", date: "2024-04-10" }
            ],
            certificates: [
                { title: "VLSI Design Certification", organization: "CDAC", date: "2024-03-05", id: "VLSI-567890" }
            ],
            internships: [
                { company: "Intel", role: "Hardware Intern", duration: "2 months", description: "Chip design and verification" }
            ],
            profileImage: "https://ui-avatars.com/api/?name=Priya+Reddy&background=28a745&color=fff&size=150&bold=true",
            headline: "Electronics Engineer | IoT Specialist",
            bio: "Focused on embedded systems and IoT innovations.",
            credits: 52,
            fatherName: "Venkat Reddy",
            motherName: "Lakshmi Reddy",
            phone: "+91 9876543211",
            socialMedia: {
                linkedin: "https://linkedin.com/in/priyareddy",
                github: "https://github.com/priyareddy"
            }
        }
    ],
    faculty: [
        {
            id: 1,
            name: "Dr. Rajesh Kumar",
            email: "rajesh.kumar@anits.edu.in",
            college: "ANITS",
            department: "Computer Science",
            designation: "Professor",
            experience: "15 years",
            articles: [
                { title: "Future of AI in Education", content: "Artificial Intelligence is transforming...", date: "2024-03-20" },
                { title: "Machine Learning Best Practices", content: "When implementing ML solutions...", date: "2024-02-15" }
            ]
        }
    ],
    colleges: [
        {
            id: 1,
            name: "ANITS",
            email: "admin@anits.edu.in",
            fullName: "Anil Neerukonda Institute of Technology & Sciences",
            location: "Visakhapatnam, Andhra Pradesh",
            courses: [
                { title: "Advanced JavaScript", description: "Deep dive into modern JS concepts", youtubeLink: "https://youtube.com/watch?v=example1" },
                { title: "Data Structures", description: "Comprehensive DSA course", youtubeLink: "https://youtube.com/watch?v=example2" }
            ],
            events: [
                { title: "Tech Fest 2024", description: "Annual technical festival", date: "2024-04-15" },
                { title: "Workshop on AI", description: "Hands-on AI workshop", date: "2024-03-25" }
            ]
        }
    ],
    companies: [
        {
            id: 1,
            name: "TechCorp Solutions",
            email: "hr@techcorp.com",
            industry: "Software Development",
            avatar: "https://ui-avatars.com/api/?name=TechCorp+Solutions&background=dc2626&color=fff&size=150&bold=true",
            companyData: {
                name: "TechCorp Solutions",
                industry: "Software Development",
                size: "medium",
                phone: "+1-555-0123",
                website: "https://techcorp.com",
                address: "123 Tech Street, Silicon Valley, CA 94000",
                hrContact: "Sarah Johnson",
                description: "Leading software development company specializing in cutting-edge solutions for enterprise clients."
            },
            opportunities: [
                { title: "Software Engineer", role: "Full Stack Developer", description: "Work on cutting-edge projects", skills: ["JavaScript", "React", "Node.js"] },
                { title: "Data Scientist", role: "ML Engineer", description: "Build AI solutions", skills: ["Python", "Machine Learning", "TensorFlow"] }
            ]
        }
    ]
};

// Modal Functions
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
    updateLoginForm();
}

function showRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
    updateRegisterForm();
}

function switchToRegister() {
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    setTimeout(() => showRegisterModal(), 300);
}

function switchToLogin() {
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    setTimeout(() => showLoginModal(), 300);
}

// Update login form based on user type
function updateLoginForm() {
    const loginType = document.querySelector('input[name="loginType"]:checked').value;
    const emailHelp = document.getElementById('emailHelp');

    switch (loginType) {
        case 'student':
            emailHelp.textContent = 'Use your personal or college email address';
            break;
        case 'faculty':
            emailHelp.textContent = 'Use your college domain email address';
            break;
        case 'college':
            emailHelp.textContent = 'Use your official institutional email address';
            break;
        case 'company':
            emailHelp.textContent = 'Use your company email address';
            break;
    }
}

// Update register form based on user type
function updateRegisterForm() {
    const registerType = document.querySelector('input[name="registerType"]:checked').value;
    const formContent = document.getElementById('registerFormContent');

    let formHTML = '';

    switch (registerType) {
        case 'student':
            formHTML = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regFirstName" class="form-label">First Name *</label>
                        <input type="text" class="form-control" id="regFirstName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regLastName" class="form-label">Last Name *</label>
                        <input type="text" class="form-control" id="regLastName" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regEmail" class="form-label">Email Address *</label>
                    <input type="email" class="form-control" id="regEmail" required>
                    <div class="form-text">You can use personal or college email</div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regCollege" class="form-label">College/University *</label>
                        <input type="text" class="form-control" id="regCollege" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regCourse" class="form-label">Course *</label>
                        <select class="form-control" id="regCourse" required>
                            <option value="">Select Course</option>
                            <option value="btech">B.Tech</option>
                            <option value="be">B.E</option>
                            <option value="bsc">B.Sc</option>
                            <option value="mtech">M.Tech</option>
                            <option value="msc">M.Sc</option>
                            <option value="phd">Ph.D</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regYear" class="form-label">Current Year *</label>
                        <select class="form-control" id="regYear" required>
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regPhone" class="form-label">Phone Number *</label>
                        <input type="tel" class="form-control" id="regPhone" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regPassword" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="regPassword" required>
                </div>
                <div class="mb-3">
                    <label for="regConfirmPassword" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="regConfirmPassword" required>
                </div>
            `;
            break;

        case 'faculty':
            formHTML = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regFirstName" class="form-label">First Name *</label>
                        <input type="text" class="form-control" id="regFirstName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regLastName" class="form-label">Last Name *</label>
                        <input type="text" class="form-control" id="regLastName" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regEmail" class="form-label">College Email Address *</label>
                    <input type="email" class="form-control" id="regEmail" required>
                    <div class="form-text">Must use official college domain email</div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regCollege" class="form-label">Institution *</label>
                        <input type="text" class="form-control" id="regCollege" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regDepartment" class="form-label">Department *</label>
                        <input type="text" class="form-control" id="regDepartment" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regDesignation" class="form-label">Designation *</label>
                        <select class="form-control" id="regDesignation" required>
                            <option value="">Select Designation</option>
                            <option value="assistant-professor">Assistant Professor</option>
                            <option value="associate-professor">Associate Professor</option>
                            <option value="professor">Professor</option>
                            <option value="hod">Head of Department</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regExperience" class="form-label">Experience (Years) *</label>
                        <input type="number" class="form-control" id="regExperience" min="0" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regEmployeeId" class="form-label">Employee ID *</label>
                    <input type="text" class="form-control" id="regEmployeeId" required>
                </div>
                <div class="mb-3">
                    <label for="regPassword" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="regPassword" required>
                </div>
                <div class="mb-3">
                    <label for="regConfirmPassword" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="regConfirmPassword" required>
                </div>
            `;
            break;

        case 'college':
            formHTML = `
                <div class="mb-3">
                    <label for="regInstitutionName" class="form-label">Institution Name *</label>
                    <input type="text" class="form-control" id="regInstitutionName" required>
                </div>
                <div class="mb-3">
                    <label for="regEmail" class="form-label">Official Email Address *</label>
                    <input type="email" class="form-control" id="regEmail" required>
                    <div class="form-text">Must use official institutional domain</div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regType" class="form-label">Institution Type *</label>
                        <select class="form-control" id="regType" required>
                            <option value="">Select Type</option>
                            <option value="college">College</option>
                            <option value="university">University</option>
                            <option value="school">School</option>
                            <option value="institute">Institute</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regAffiliation" class="form-label">Affiliation *</label>
                        <input type="text" class="form-control" id="regAffiliation" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regLocation" class="form-label">Complete Address *</label>
                    <textarea class="form-control" id="regLocation" rows="3" required></textarea>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regEstablished" class="form-label">Established Year *</label>
                        <input type="number" class="form-control" id="regEstablished" min="1800" max="2024" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regPhone" class="form-label">Contact Number *</label>
                        <input type="tel" class="form-control" id="regPhone" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regWebsite" class="form-label">Official Website</label>
                    <input type="url" class="form-control" id="regWebsite">
                </div>
                <div class="mb-3">
                    <label for="regPassword" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="regPassword" required>
                </div>
                <div class="mb-3">
                    <label for="regConfirmPassword" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="regConfirmPassword" required>
                </div>
            `;
            break;

        case 'company':
            formHTML = `
                <div class="mb-3">
                    <label for="regCompanyName" class="form-label">Company Name *</label>
                    <input type="text" class="form-control" id="regCompanyName" required>
                </div>
                <div class="mb-3">
                    <label for="regEmail" class="form-label">Company Email Address *</label>
                    <input type="email" class="form-control" id="regEmail" required>
                    <div class="form-text">Use official company domain email</div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regIndustry" class="form-label">Industry *</label>
                        <select class="form-control" id="regIndustry" required>
                            <option value="">Select Industry</option>
                            <option value="it">Information Technology</option>
                            <option value="finance">Finance & Banking</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="consulting">Consulting</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regSize" class="form-label">Company Size *</label>
                        <select class="form-control" id="regSize" required>
                            <option value="">Select Size</option>
                            <option value="startup">Startup (1-50)</option>
                            <option value="medium">Medium (51-500)</option>
                            <option value="large">Large (500+)</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regLocation" class="form-label">Headquarters Location *</label>
                    <input type="text" class="form-control" id="regLocation" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="regHrName" class="form-label">HR Contact Name *</label>
                        <input type="text" class="form-control" id="regHrName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="regPhone" class="form-label">Contact Number *</label>
                        <input type="tel" class="form-control" id="regPhone" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="regWebsite" class="form-label">Company Website *</label>
                    <input type="url" class="form-control" id="regWebsite" required>
                </div>
                <div class="mb-3">
                    <label for="regPassword" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="regPassword" required>
                </div>
                <div class="mb-3">
                    <label for="regConfirmPassword" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="regConfirmPassword" required>
                </div>
            `;
            break;
    }

    formContent.innerHTML = formHTML;
}

// Password toggle function
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling.querySelector('i');

    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Login type change
    document.querySelectorAll('input[name="loginType"]').forEach(radio => {
        radio.addEventListener('change', updateLoginForm);
    });

    // Register type change
    document.querySelectorAll('input[name="registerType"]').forEach(radio => {
        radio.addEventListener('change', updateRegisterForm);
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin();
    });

    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleRegister();
    });

    // Initialize forms
    updateLoginForm();
    updateRegisterForm();
});

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.querySelector('input[name="loginType"]:checked').value;

    // Simulate login validation
    let user = null;

    switch (userType) {
        case 'student':
            user = dummyData.students.find(s => s.email === email);
            break;
        case 'faculty':
            user = dummyData.faculty.find(f => f.email === email);
            break;
        case 'college':
            user = dummyData.colleges.find(c => c.email === email);
            break;
        case 'company':
            user = dummyData.companies.find(c => c.email === email);
            break;
    }

    if (user) {
        currentUser = user;
        currentUserType = userType;

        // Store in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentUserType', userType);

        // Hide modal and redirect
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();

        setTimeout(() => {
            switch (userType) {
                case 'student':
                    window.location.href = 'student-dashboard.html';
                    break;
                case 'faculty':
                    window.location.href = 'faculty-dashboard.html';
                    break;
                case 'college':
                    window.location.href = 'college-dashboard.html';
                    break;
                case 'company':
                    window.location.href = 'company-dashboard.html';
                    break;
            }
        }, 500);
    } else {
        showAlert('Invalid credentials. Please try again.', 'danger');
    }
}

// Handle registration
function handleRegister() {
    const userType = document.querySelector('input[name="registerType"]:checked').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'danger');
        return;
    }

    // Simulate registration success
    showAlert('Registration successful! You can now login with your credentials.', 'success');

    setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        setTimeout(() => showLoginModal(), 500);
    }, 2000);
}

// Show alert function
function showAlert(message, type) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Find the modal body and prepend alert
    const activeModal = document.querySelector('.modal.show .modal-body');
    if (activeModal) {
        activeModal.insertAdjacentHTML('afterbegin', alertHTML);
    }
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const userType = localStorage.getItem('currentUserType');

    if (user && userType) {
        currentUser = JSON.parse(user);
        currentUserType = userType;
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    currentUser = null;
    currentUserType = null;
    window.location.href = 'index.html';
}

// Search functionality
function searchStudents(query, skillFilter = '') {
    let results = dummyData.students;

    if (query) {
        results = results.filter(student =>
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.college.toLowerCase().includes(query.toLowerCase()) ||
            student.course.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (skillFilter) {
        results = results.filter(student =>
            student.skills.some(skill =>
                skill.toLowerCase().includes(skillFilter.toLowerCase())
            )
        );
    }

    return results;
}

// Generate dummy student data for demonstration
function generateMoreStudents() {
    const names = ["Rahul Kumar", "Sneha Patel", "Vikram Singh", "Anita Sharma", "Rohit Gupta"];
    const colleges = ["ANITS", "GITAM", "VIT", "SRM", "MIT"];
    const courses = ["B.Tech CSE", "B.Tech ECE", "B.Tech ME", "M.Tech", "MBA"];
    const skills = ["Java", "Python", "JavaScript", "React", "Angular", "Node.js", "Machine Learning", "Data Science"];

    for (let i = 0; i < 10; i++) {
        const student = {
            id: dummyData.students.length + 1,
            name: names[Math.floor(Math.random() * names.length)] + " " + (i + 1),
            email: `student${i + 3}@${colleges[Math.floor(Math.random() * colleges.length)].toLowerCase()}.edu.in`,
            college: colleges[Math.floor(Math.random() * colleges.length)],
            course: courses[Math.floor(Math.random() * courses.length)],
            year: `${Math.floor(Math.random() * 4) + 1}${Math.random() < 0.5 ? 'st' : 'nd'} Year`,
            cgpa: (Math.random() * 3 + 7).toFixed(1),
            skills: skills.slice(0, Math.floor(Math.random() * 4) + 2),
            achievements: [],
            certificates: [],
            internships: [],
            profileImage: `https://via.placeholder.com/150/${Math.floor(Math.random() * 16777215).toString(16)}/white?text=${student.name.split(' ').map(n => n[0]).join('')}`,
            headline: "Engineering Student | Tech Enthusiast",
            bio: "Passionate about technology and learning new skills.",
            credits: Math.floor(Math.random() * 50) + 10,
            fatherName: "Father Name",
            motherName: "Mother Name",
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            socialMedia: {
                linkedin: "#",
                github: "#"
            }
        };
        dummyData.students.push(student);
    }
}

// Initialize additional dummy data
generateMoreStudents();

// Additional utility functions for dashboards
function getCurrentUser() {
    if (checkAuth()) {
        return currentUser;
    }
    return null;
}

function getDummyData() {
    return dummyData;
}

function updateUser(userData) {
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function saveUserSession(userData) {
    currentUser = userData;
    currentUserType = userData.type;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('currentUserType', userData.type);
}

// Initialize session on page load
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on a dashboard page and need to maintain session
    const currentPage = window.location.pathname.split('/').pop();
    const dashboardPages = ['student-dashboard.html', 'faculty-dashboard.html', 'college-dashboard.html', 'company-dashboard.html', 'resume-generator.html', 'articles.html', 'events.html'];

    if (dashboardPages.includes(currentPage)) {
        if (!checkAuth()) {
            // Only redirect if we're on a dashboard page without valid auth
            window.location.href = 'index.html';
        }
    }
});