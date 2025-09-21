// Data Management Utility
class DataManager {
    constructor() {
        this.baseUrl = './data/';
        this.imageBaseUrl = './images/';
        this.defaultImages = {
            student: './images/profiles/default-student.svg',
            faculty: './images/profiles/default-faculty.svg',
            college: './images/profiles/default-college.svg',
            company: './images/profiles/default-company.svg'
        };
    }

    // Get default profile image based on user type
    getDefaultProfileImage(userType, userName = '') {
        // Always use UI-Avatars for consistent, government-appropriate styling
        if (userName) {
            // Generate initials-based placeholder with government colors
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
            const govColors = {
                student: '1f4e79',    // Deep blue
                faculty: '2d5016',    // Deep green  
                college: '5b2c6f',    // Deep purple
                company: '833c0c'     // Deep orange
            };
            const color = govColors[userType] || govColors.student;
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=${color}&color=fff&size=150&bold=true&font-size=0.5`;
        }

        // Fallback to colored initials for user type
        const typeInitials = {
            student: 'ST',
            faculty: 'FC',
            college: 'CL',
            company: 'CO'
        };
        const govColors = {
            student: '1f4e79',
            faculty: '2d5016',
            college: '5b2c6f',
            company: '833c0c'
        };
        const initials = typeInitials[userType] || 'U';
        const color = govColors[userType] || govColors.student;
        return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=150&bold=true&font-size=0.6`;
    }

    // Save data to JSON file (simulate with localStorage for demo)
    async saveData(filename, data) {
        try {
            const key = `data_${filename.replace('.json', '')}`;
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Data saved to ${filename}`);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Load data from JSON file (simulate with localStorage for demo)
    async loadData(filename) {
        try {
            const key = `data_${filename.replace('.json', '')}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // Save image file (simulate with localStorage for demo)
    async saveImage(file, folder = 'profiles') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                const filename = `${Date.now()}_${file.name}`;
                const key = `image_${folder}_${filename}`;

                try {
                    localStorage.setItem(key, imageData);
                    const imagePath = `./images/${folder}/${filename}`;
                    console.log(`Image saved to ${imagePath}`);
                    resolve(imagePath);
                } catch (error) {
                    console.error('Error saving image:', error);
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Get image from storage
    getImage(imagePath) {
        if (imagePath.startsWith('./images/')) {
            const pathParts = imagePath.split('/');
            const folder = pathParts[2];
            const filename = pathParts[3];
            const key = `image_${folder}_${filename}`;
            return localStorage.getItem(key) || imagePath;
        }
        return imagePath;
    }

    // Save student achievement
    async saveAchievement(studentId, achievement) {
        const data = await this.loadData('student-data.json') || { achievements: [] };
        if (!data.achievements) data.achievements = [];

        achievement.id = Date.now();
        achievement.studentId = studentId;
        achievement.timestamp = new Date().toISOString();

        data.achievements.push(achievement);
        await this.saveData('student-data.json', data);
        return achievement;
    }

    // Save student certificate
    async saveCertificate(studentId, certificate) {
        const data = await this.loadData('student-data.json') || { certificates: [] };
        if (!data.certificates) data.certificates = [];

        certificate.id = Date.now();
        certificate.studentId = studentId;
        certificate.timestamp = new Date().toISOString();

        data.certificates.push(certificate);
        await this.saveData('student-data.json', data);
        return certificate;
    }

    // Save student skill
    async saveSkill(studentId, skill) {
        const data = await this.loadData('student-data.json') || { skills: [] };
        if (!data.skills) data.skills = [];

        const skillData = {
            id: Date.now(),
            studentId: studentId,
            skill: skill,
            timestamp: new Date().toISOString()
        };

        data.skills.push(skillData);
        await this.saveData('student-data.json', data);
        return skillData;
    }

    // Save internship
    async saveInternship(studentId, internship) {
        const data = await this.loadData('student-data.json') || { internships: [] };
        if (!data.internships) data.internships = [];

        internship.id = Date.now();
        internship.studentId = studentId;
        internship.timestamp = new Date().toISOString();

        data.internships.push(internship);
        await this.saveData('student-data.json', data);
        return internship;
    }

    // Get student data
    async getStudentData(studentId) {
        const data = await this.loadData('student-data.json') || {};

        return {
            achievements: (data.achievements || []).filter(item => item.studentId === studentId),
            certificates: (data.certificates || []).filter(item => item.studentId === studentId),
            skills: (data.skills || []).filter(item => item.studentId === studentId),
            internships: (data.internships || []).filter(item => item.studentId === studentId),
            projects: (data.projects || []).filter(item => item.studentId === studentId)
        };
    }

    // Update user profile image
    async updateProfileImage(userId, userType, imageFile) {
        try {
            let imagePath;

            if (imageFile) {
                // Save uploaded image
                imagePath = await this.saveImage(imageFile, 'profiles');
            } else {
                // Use default image
                const userData = await this.getCurrentUser();
                imagePath = this.getDefaultProfileImage(userType, userData?.name);
            }

            // Update user data
            const users = await this.loadData('users.json') || { students: [], faculty: [], colleges: [], companies: [] };
            const userKey = userType + 's';

            if (users[userKey]) {
                const userIndex = users[userKey].findIndex(user => user.id === userId);
                if (userIndex !== -1) {
                    users[userKey][userIndex].profileImage = imagePath;
                    users[userKey][userIndex].avatar = imagePath; // For compatibility
                    await this.saveData('users.json', users);
                }
            }

            // Update current user in localStorage
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                currentUser.profileImage = imagePath;
                currentUser.avatar = imagePath;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            return imagePath;
        } catch (error) {
            console.error('Error updating profile image:', error);
            throw error;
        }
    }

    // Initialize default data if not exists
    async initializeData() {
        // Check if data exists
        let userData = await this.loadData('users.json');
        if (!userData) {
            // Copy dummy data from script.js to localStorage
            if (typeof dummyData !== 'undefined') {
                await this.saveData('users.json', dummyData);
                console.log('Initialized user data from dummy data');
            }
        }

        let studentData = await this.loadData('student-data.json');
        if (!studentData) {
            studentData = {
                achievements: [],
                certificates: [],
                internships: [],
                projects: [],
                skills: [],
                articles: [],
                events: []
            };
            await this.saveData('student-data.json', studentData);
            console.log('Initialized student data structure');
        }
    }
}

// Global instance
const dataManager = new DataManager();

// Initialize data when script loads
document.addEventListener('DOMContentLoaded', function () {
    dataManager.initializeData();
});

// Utility functions for form handling
function handleImageUpload(inputElement, previewElement, userType = 'student') {
    const file = inputElement.files[0];

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB.', 'error');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onload = function (e) {
            if (previewElement) {
                previewElement.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);

        return file;
    }
    return null;
}

// Enhanced form submission with data persistence
async function submitForm(formData, formType, studentId = null) {
    try {
        const currentUser = getCurrentUser();
        const userId = studentId || currentUser?.id;

        if (!userId) {
            showToast('User not found. Please login again.', 'error');
            return false;
        }

        let result;

        switch (formType) {
            case 'achievement':
                result = await dataManager.saveAchievement(userId, formData);
                break;
            case 'certificate':
                result = await dataManager.saveCertificate(userId, formData);
                break;
            case 'skill':
                result = await dataManager.saveSkill(userId, formData);
                break;
            case 'internship':
                result = await dataManager.saveInternship(userId, formData);
                break;
            default:
                throw new Error('Unknown form type');
        }

        showToast(`${formType.charAt(0).toUpperCase() + formType.slice(1)} saved successfully!`, 'success');
        return result;

    } catch (error) {
        console.error('Error submitting form:', error);
        showToast(`Error saving ${formType}. Please try again.`, 'error');
        return false;
    }
}

// Load user-specific data
async function loadUserData(userId = null) {
    try {
        const currentUser = getCurrentUser();
        const targetUserId = userId || currentUser?.id;

        if (!targetUserId) {
            console.warn('No user ID provided for loading data');
            return null;
        }

        const userData = await dataManager.getStudentData(targetUserId);
        return userData;

    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}