// const bcrypt = require("bcrypt")

const { execSync } = require('child_process');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(7);

exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}



exports.comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

module.exports.getCurrentGitBranchName = () => {
    try {
        // Run the "git rev-parse --abbrev-ref HEAD" command to get the current branch name
        const branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
        if (branchName == 'dev_br')
            return 'dev';
        else if (branchName == 'test')
            return 'test'
        else if (branchName == 'master')
            return 'prod'
        else
            return 'local'
    } catch (error) {
        // Handle errors, e.g., when not in a Git repository
        console.error('Error:', error.message);
        return null;
    }
}