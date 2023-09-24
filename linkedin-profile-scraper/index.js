"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedInProfileScraper = void 0;
const tslib_1 = require("tslib");
const puppeteer_1 = tslib_1.__importDefault(require("puppeteer"));
const tree_kill_1 = tslib_1.__importDefault(require("tree-kill"));
const blocked_hosts_1 = tslib_1.__importDefault(require("./blocked-hosts"));
const utils_1 = require("./utils");
const errors_1 = require("./errors");
function autoScroll(page) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => {
            return new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 500;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 100);
            });
        });
    });
}
class LinkedInProfileScraper {
    constructor(userDefinedOptions) {
        this.options = {
            sessionCookieValue: '',
            keepAlive: false,
            timeout: 10000,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            headless: true
        };
        this.browser = null;
        this.setup = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const logSection = 'setup';
            try {
                utils_1.statusLog(logSection, `Launching puppeteer in the ${this.options.headless ? 'background' : 'foreground'}...`);
                this.browser = yield puppeteer_1.default.launch({
                    headless: this.options.headless,
                    args: [
                        ...(this.options.headless ? '---single-process' : '---start-maximized'),
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        "--proxy-server='direct://",
                        '--proxy-bypass-list=*',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu',
                        '--disable-features=site-per-process',
                        '--enable-features=NetworkService',
                        '--allow-running-insecure-content',
                        '--enable-automation',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--disable-web-security',
                        '--autoplay-policy=user-gesture-required',
                        '--disable-background-networking',
                        '--disable-breakpad',
                        '--disable-client-side-phishing-detection',
                        '--disable-component-update',
                        '--disable-default-apps',
                        '--disable-domain-reliability',
                        '--disable-extensions',
                        '--disable-features=AudioServiceOutOfProcess',
                        '--disable-hang-monitor',
                        '--disable-ipc-flooding-protection',
                        '--disable-notifications',
                        '--disable-offer-store-unmasked-wallet-cards',
                        '--disable-popup-blocking',
                        '--disable-print-preview',
                        '--disable-prompt-on-repost',
                        '--disable-speech-api',
                        '--disable-sync',
                        '--disk-cache-size=33554432',
                        '--hide-scrollbars',
                        '--ignore-gpu-blacklist',
                        '--metrics-recording-only',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--no-first-run',
                        '--no-pings',
                        '--no-zygote',
                        '--password-store=basic',
                        '--use-gl=swiftshader',
                        '--use-mock-keychain'
                    ],
                    timeout: this.options.timeout
                });
                utils_1.statusLog(logSection, 'Puppeteer launched!');
                yield this.checkIfLoggedIn();
                utils_1.statusLog(logSection, 'Done!');
            }
            catch (err) {
                yield this.close();
                utils_1.statusLog(logSection, 'An error occurred during setup.');
                throw err;
            }
        });
        this.createPage = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const logSection = 'setup page';
            if (!this.browser) {
                throw new Error('Browser not set.');
            }
            const blockedResources = ['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
            try {
                const page = yield this.browser.newPage();
                const firstPage = (yield this.browser.pages())[0];
                yield firstPage.close();
                const session = yield page.target().createCDPSession();
                yield page.setBypassCSP(true);
                yield session.send('Page.enable');
                yield session.send('Page.setWebLifecycleState', {
                    state: 'active',
                });
                utils_1.statusLog(logSection, `Blocking the following resources: ${blockedResources.join(', ')}`);
                const blockedHosts = this.getBlockedHosts();
                const blockedResourcesByHost = ['script', 'xhr', 'fetch', 'document'];
                utils_1.statusLog(logSection, `Should block scripts from ${Object.keys(blockedHosts).length} unwanted hosts to speed up the crawling.`);
                yield page.setRequestInterception(true);
                page.on('request', (req) => {
                    if (blockedResources.includes(req.resourceType())) {
                        return req.abort();
                    }
                    const hostname = utils_1.getHostname(req.url());
                    if (blockedResourcesByHost.includes(req.resourceType()) && hostname && blockedHosts[hostname] === true) {
                        utils_1.statusLog('blocked script', `${req.resourceType()}: ${hostname}: ${req.url()}`);
                        return req.abort();
                    }
                    return req.continue();
                });
                yield page.setUserAgent(this.options.userAgent);
                yield page.setViewport({
                    width: 1200,
                    height: 720
                });
                utils_1.statusLog(logSection, `Setting session cookie using cookie: ${process.env.LINKEDIN_SESSION_COOKIE_VALUE}`);
                yield page.setCookie({
                    'name': 'li_at',
                    'value': this.options.sessionCookieValue,
                    'domain': '.www.linkedin.com'
                });
                utils_1.statusLog(logSection, 'Session cookie set!');
                utils_1.statusLog(logSection, 'Done!');
                return page;
            }
            catch (err) {
                yield this.close();
                utils_1.statusLog(logSection, 'An error occurred during page setup.');
                utils_1.statusLog(logSection, err.message);
                throw err;
            }
        });
        this.getBlockedHosts = () => {
            const blockedHostsArray = blocked_hosts_1.default.split('\n');
            let blockedHostsObject = blockedHostsArray.reduce((prev, curr) => {
                const frags = curr.split(' ');
                if (frags.length > 1 && frags[0] === '0.0.0.0') {
                    prev[frags[1].trim()] = true;
                }
                return prev;
            }, {});
            blockedHostsObject = Object.assign(Object.assign({}, blockedHostsObject), { 'static.chartbeat.com': true, 'scdn.cxense.com': true, 'api.cxense.com': true, 'www.googletagmanager.com': true, 'connect.facebook.net': true, 'platform.twitter.com': true, 'tags.tiqcdn.com': true, 'dev.visualwebsiteoptimizer.com': true, 'smartlock.google.com': true, 'cdn.embedly.com': true });
            return blockedHostsObject;
        };
        this.close = (page) => {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const loggerPrefix = 'close';
                if (page) {
                    try {
                        utils_1.statusLog(loggerPrefix, 'Closing page...');
                        yield page.close();
                        utils_1.statusLog(loggerPrefix, 'Closed page!');
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                if (this.browser) {
                    try {
                        utils_1.statusLog(loggerPrefix, 'Closing browser...');
                        yield this.browser.close();
                        utils_1.statusLog(loggerPrefix, 'Closed browser!');
                        const browserProcessPid = this.browser.process().pid;
                        if (browserProcessPid) {
                            utils_1.statusLog(loggerPrefix, `Killing browser process pid: ${browserProcessPid}...`);
                            tree_kill_1.default(browserProcessPid, 'SIGKILL', (err) => {
                                if (err) {
                                    return reject(`Failed to kill browser process pid: ${browserProcessPid}`);
                                }
                                utils_1.statusLog(loggerPrefix, `Killed browser pid: ${browserProcessPid} Closed browser.`);
                                resolve();
                            });
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                return resolve();
            }));
        };
        this.checkIfLoggedIn = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const logSection = 'checkIfLoggedIn';
            const page = yield this.createPage();
            utils_1.statusLog(logSection, 'Checking if we are still logged in...');
            yield page.goto('https://www.linkedin.com/login', {
                waitUntil: 'networkidle2',
                timeout: this.options.timeout
            });
            const url = page.url();
            const isLoggedIn = !url.endsWith('/login');
            yield page.close();
            if (isLoggedIn) {
                utils_1.statusLog(logSection, 'All good. We are still logged in.');
            }
            else {
                const errorMessage = 'Bad news, we are not logged in! Your session seems to be expired. Use your browser to login again with your LinkedIn credentials and extract the "li_at" cookie value for the "sessionCookieValue" option.';
                utils_1.statusLog(logSection, errorMessage);
                throw new errors_1.SessionExpired(errorMessage);
            }
        });
        this.run = (profileUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const logSection = 'run';
            const scraperSessionId = new Date().getTime();
            if (!this.browser) {
                throw new Error('Browser is not set. Please run the setup method first.');
            }
            if (!profileUrl) {
                throw new Error('No profileUrl given.');
            }
            if (!profileUrl.includes('linkedin.com/')) {
                throw new Error('The given URL to scrape is not a linkedin.com url.');
            }
            try {
                const page = yield this.createPage();
                utils_1.statusLog(logSection, `Navigating to LinkedIn profile: ${profileUrl}`, scraperSessionId);
                yield page.goto(profileUrl, {
                    waitUntil: 'domcontentloaded',
                    timeout: this.options.timeout
                });
                utils_1.statusLog(logSection, 'LinkedIn profile page loaded!', scraperSessionId);
                utils_1.statusLog(logSection, 'Getting all the LinkedIn profile data by scrolling the page to the bottom, so all the data gets loaded into the page...', scraperSessionId);
                yield autoScroll(page);
                utils_1.statusLog(logSection, 'Parsing data...', scraperSessionId);
                const expandButtonsSelectors = [
                    '.pv-profile-section.pv-about-section .lt-line-clamp__more',
                    '#experience-section .pv-profile-section__see-more-inline.link',
                    '.pv-profile-section.education-section button.pv-profile-section__see-more-inline',
                    '.pv-skill-categories-section [data-control-name="skill_details"]',
                ];
                const seeMoreButtonsSelectors = ['.pv-entity__description .lt-line-clamp__line.lt-line-clamp__line--last .lt-line-clamp__more[href="#"]', '.lt-line-clamp__more[href="#"]:not(.lt-line-clamp__ellipsis--dummy)'];
                utils_1.statusLog(logSection, 'Expanding all sections by clicking their "See more" buttons', scraperSessionId);
                for (const buttonSelector of expandButtonsSelectors) {
                    try {
                        if ((yield page.$(buttonSelector)) !== null) {
                            utils_1.statusLog(logSection, `Clicking button ${buttonSelector}`, scraperSessionId);
                            yield page.click(buttonSelector);
                        }
                    }
                    catch (err) {
                        utils_1.statusLog(logSection, `Could not find or click expand button selector "${buttonSelector}". So we skip that one.`, scraperSessionId);
                    }
                }
                yield page.waitFor(100);
                utils_1.statusLog(logSection, 'Expanding all descriptions by clicking their "See more" buttons', scraperSessionId);
                for (const seeMoreButtonSelector of seeMoreButtonsSelectors) {
                    const buttons = yield page.$$(seeMoreButtonSelector);
                    for (const button of buttons) {
                        if (button) {
                            try {
                                utils_1.statusLog(logSection, `Clicking button ${seeMoreButtonSelector}`, scraperSessionId);
                                yield button.click();
                            }
                            catch (err) {
                                utils_1.statusLog(logSection, `Could not find or click see more button selector "${button}". So we skip that one.`, scraperSessionId);
                            }
                        }
                    }
                }
                utils_1.statusLog(logSection, 'Parsing profile data...', scraperSessionId);
                const rawUserProfileData = yield page.evaluate(() => {
                    const profileSection = document.querySelector('#profile-content');
                    const url = window.location.href;
                    const fullNameElement = profileSection === null || profileSection === void 0 ? void 0 : profileSection.querySelector('.pv-text-details__left-panel h1');
                    const fullName = (fullNameElement === null || fullNameElement === void 0 ? void 0 : fullNameElement.textContent) || null;
                    const titleElement = profileSection === null || profileSection === void 0 ? void 0 : profileSection.querySelector('section div.pv-text-details__left-panel div.text-body-medium.break-words');
                    const title = (titleElement === null || titleElement === void 0 ? void 0 : titleElement.textContent) || null;
                    const locationElement = profileSection === null || profileSection === void 0 ? void 0 : profileSection.querySelector('.pv-text-details__left-panel>span.text-body-small');
                    const location = (locationElement === null || locationElement === void 0 ? void 0 : locationElement.textContent) || null;
                    const descriptionElement = profileSection === null || profileSection === void 0 ? void 0 : profileSection.querySelector('#about ~ div:nth-child(3)');
                    const description = (descriptionElement === null || descriptionElement === void 0 ? void 0 : descriptionElement.textContent) || null;
                    return {
                        fullName,
                        title,
                        location,
                        description,
                        url
                    };
                });
                const userProfile = Object.assign(Object.assign({}, rawUserProfileData), { fullName: utils_1.getCleanText(rawUserProfileData.fullName), title: utils_1.getCleanText(rawUserProfileData.title), location: rawUserProfileData.location ? utils_1.getLocationFromText(rawUserProfileData.location) : null, description: utils_1.getCleanText(rawUserProfileData.description) });
                utils_1.statusLog(logSection, `Got user profile data: ${JSON.stringify(userProfile)}`, scraperSessionId);
                utils_1.statusLog(logSection, `Parsing experiences data...`, scraperSessionId);
                const rawExperiencesData = yield page.$$eval('#experience ~ div:nth-child(3) > ul > li', (nodes) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    let data = [];
                    for (const node of nodes) {
                        const check_evolucion = node.querySelector(".pvs-entity__path-node");
                        let titleElement;
                        let dateRangeElement;
                        let employmentType;
                        let company;
                        let location;
                        if (check_evolucion) {
                            const elementos = node.querySelectorAll(".pvs-entity.pvs-entity--with-path span:first-child");
                            titleElement = elementos[0];
                            dateRangeElement = elementos[2];
                            const employmentTypeElement = elementos[1];
                            employmentType = employmentTypeElement === null || employmentTypeElement === void 0 ? void 0 : employmentTypeElement.textContent;
                            const companyElement = node.querySelector("span:first-child");
                            company = companyElement === null || companyElement === void 0 ? void 0 : companyElement.textContent;
                            const locationElement = node.querySelector("div:nth-child(2)>div:first-child span:nth-child(3)>span:first-child");
                            location = ((_a = locationElement === null || locationElement === void 0 ? void 0 : locationElement.textContent) === null || _a === void 0 ? void 0 : _a.split("·")[0].trim()) || null;
                        }
                        else {
                            titleElement = node.querySelector('div.display-flex.align-items-center.mr1.t-bold>span:first-child');
                            const elementos = node.querySelectorAll("span.t-14.t-normal>span:first-child");
                            const employmentTypeElement = elementos[0];
                            employmentType = ((_c = (_b = employmentTypeElement === null || employmentTypeElement === void 0 ? void 0 : employmentTypeElement.textContent) === null || _b === void 0 ? void 0 : _b.split("·")[1]) === null || _c === void 0 ? void 0 : _c.trim()) || null;
                            company = ((_e = (_d = employmentTypeElement === null || employmentTypeElement === void 0 ? void 0 : employmentTypeElement.textContent) === null || _d === void 0 ? void 0 : _d.split("·")[0]) === null || _e === void 0 ? void 0 : _e.trim()) || null;
                            dateRangeElement = elementos[1];
                            const locationElement = elementos[2];
                            location = ((_f = locationElement === null || locationElement === void 0 ? void 0 : locationElement.textContent) === null || _f === void 0 ? void 0 : _f.split("·")[0].trim()) || null;
                        }
                        const title = (titleElement === null || titleElement === void 0 ? void 0 : titleElement.textContent) || null;
                        const dateRangeText = (dateRangeElement === null || dateRangeElement === void 0 ? void 0 : dateRangeElement.textContent) || null;
                        const startDatePart = (dateRangeText === null || dateRangeText === void 0 ? void 0 : dateRangeText.split('-')[0]) || null;
                        const startDate = (startDatePart === null || startDatePart === void 0 ? void 0 : startDatePart.trim()) || null;
                        const endDatePart = ((_g = dateRangeText === null || dateRangeText === void 0 ? void 0 : dateRangeText.split('-')[1]) === null || _g === void 0 ? void 0 : _g.split("·")[0]) || null;
                        const endDateIsPresent = (endDatePart === null || endDatePart === void 0 ? void 0 : endDatePart.trim().toLowerCase()) === 'present' || false;
                        const endDate = (endDatePart && !endDateIsPresent) ? endDatePart.trim() : 'Present';
                        data.push({
                            title,
                            company,
                            employmentType,
                            location,
                            startDate,
                            endDate,
                            endDateIsPresent,
                            description: null
                        });
                    }
                    return data;
                });
                const experiences = rawExperiencesData.map((rawExperience) => {
                    const startDate = utils_1.formatDate(rawExperience.startDate);
                    const endDate = utils_1.formatDate(rawExperience.endDate) || null;
                    const endDateIsPresent = rawExperience.endDateIsPresent;
                    const durationInDaysWithEndDate = (startDate && endDate && !endDateIsPresent) ? utils_1.getDurationInDays(startDate, endDate) : null;
                    const durationInDaysForPresentDate = (endDateIsPresent && startDate) ? utils_1.getDurationInDays(startDate, new Date()) : null;
                    const durationInDays = endDateIsPresent ? durationInDaysForPresentDate : durationInDaysWithEndDate;
                    return Object.assign(Object.assign({}, rawExperience), { title: utils_1.getCleanText(rawExperience.title), company: utils_1.getCleanText(rawExperience.company), employmentType: utils_1.getCleanText(rawExperience.employmentType), location: (rawExperience === null || rawExperience === void 0 ? void 0 : rawExperience.location) ? utils_1.getLocationFromText(rawExperience.location) : null, startDate,
                        endDate,
                        endDateIsPresent,
                        durationInDays, description: utils_1.getCleanText(rawExperience.description) });
                });
                utils_1.statusLog(logSection, `Got experiences data: ${JSON.stringify(experiences)}`, scraperSessionId);
                utils_1.statusLog(logSection, `Parsing education data...`, scraperSessionId);
                const rawEducationData = yield page.$$eval('#education-section ul > .ember-view', (nodes) => {
                    var _a, _b;
                    let data = [];
                    for (const node of nodes) {
                        const schoolNameElement = node.querySelector('h3.pv-entity__school-name');
                        const schoolName = (schoolNameElement === null || schoolNameElement === void 0 ? void 0 : schoolNameElement.textContent) || null;
                        const degreeNameElement = node.querySelector('.pv-entity__degree-name .pv-entity__comma-item');
                        const degreeName = (degreeNameElement === null || degreeNameElement === void 0 ? void 0 : degreeNameElement.textContent) || null;
                        const fieldOfStudyElement = node.querySelector('.pv-entity__fos .pv-entity__comma-item');
                        const fieldOfStudy = (fieldOfStudyElement === null || fieldOfStudyElement === void 0 ? void 0 : fieldOfStudyElement.textContent) || null;
                        const dateRangeElement = node.querySelectorAll('.pv-entity__dates time');
                        const startDatePart = dateRangeElement && ((_a = dateRangeElement[0]) === null || _a === void 0 ? void 0 : _a.textContent) || null;
                        const startDate = startDatePart || null;
                        const endDatePart = dateRangeElement && ((_b = dateRangeElement[1]) === null || _b === void 0 ? void 0 : _b.textContent) || null;
                        const endDate = endDatePart || null;
                        data.push({
                            schoolName,
                            degreeName,
                            fieldOfStudy,
                            startDate,
                            endDate
                        });
                    }
                    return data;
                });
                const education = rawEducationData.map(rawEducation => {
                    const startDate = utils_1.formatDate(rawEducation.startDate);
                    const endDate = utils_1.formatDate(rawEducation.endDate);
                    return Object.assign(Object.assign({}, rawEducation), { schoolName: utils_1.getCleanText(rawEducation.schoolName), degreeName: utils_1.getCleanText(rawEducation.degreeName), fieldOfStudy: utils_1.getCleanText(rawEducation.fieldOfStudy), startDate,
                        endDate, durationInDays: utils_1.getDurationInDays(startDate, endDate) });
                });
                utils_1.statusLog(logSection, `Got education data: ${JSON.stringify(education)}`, scraperSessionId);
                utils_1.statusLog(logSection, `Parsing volunteer experience data...`, scraperSessionId);
                const rawVolunteerExperiences = yield page.$$eval('.pv-profile-section.volunteering-section ul > li.ember-view', (nodes) => {
                    let data = [];
                    for (const node of nodes) {
                        const titleElement = node.querySelector('.pv-entity__summary-info h3');
                        const title = (titleElement === null || titleElement === void 0 ? void 0 : titleElement.textContent) || null;
                        const companyElement = node.querySelector('.pv-entity__summary-info span.pv-entity__secondary-title');
                        const company = (companyElement === null || companyElement === void 0 ? void 0 : companyElement.textContent) || null;
                        const dateRangeElement = node.querySelector('.pv-entity__date-range span:nth-child(2)');
                        const dateRangeText = (dateRangeElement === null || dateRangeElement === void 0 ? void 0 : dateRangeElement.textContent) || null;
                        const startDatePart = (dateRangeText === null || dateRangeText === void 0 ? void 0 : dateRangeText.split('–')[0]) || null;
                        const startDate = (startDatePart === null || startDatePart === void 0 ? void 0 : startDatePart.trim()) || null;
                        const endDatePart = (dateRangeText === null || dateRangeText === void 0 ? void 0 : dateRangeText.split('–')[1]) || null;
                        const endDateIsPresent = (endDatePart === null || endDatePart === void 0 ? void 0 : endDatePart.trim().toLowerCase()) === 'present' || false;
                        const endDate = (endDatePart && !endDateIsPresent) ? endDatePart.trim() : 'Present';
                        const descriptionElement = node.querySelector('.pv-entity__description');
                        const description = (descriptionElement === null || descriptionElement === void 0 ? void 0 : descriptionElement.textContent) || null;
                        data.push({
                            title,
                            company,
                            startDate,
                            endDate,
                            endDateIsPresent,
                            description
                        });
                    }
                    return data;
                });
                const volunteerExperiences = rawVolunteerExperiences.map(rawVolunteerExperience => {
                    const startDate = utils_1.formatDate(rawVolunteerExperience.startDate);
                    const endDate = utils_1.formatDate(rawVolunteerExperience.endDate);
                    return Object.assign(Object.assign({}, rawVolunteerExperience), { title: utils_1.getCleanText(rawVolunteerExperience.title), company: utils_1.getCleanText(rawVolunteerExperience.company), description: utils_1.getCleanText(rawVolunteerExperience.description), startDate,
                        endDate, durationInDays: utils_1.getDurationInDays(startDate, endDate) });
                });
                utils_1.statusLog(logSection, `Got volunteer experience data: ${JSON.stringify(volunteerExperiences)}`, scraperSessionId);
                utils_1.statusLog(logSection, `Parsing skills data...`, scraperSessionId);
                const skills = yield page.$$eval('.pv-skill-categories-section ol > .ember-view', nodes => {
                    return nodes.map((node) => {
                        var _a, _b;
                        const skillName = node.querySelector('.pv-skill-category-entity__name-text');
                        const endorsementCount = node.querySelector('.pv-skill-category-entity__endorsement-count');
                        return {
                            skillName: (skillName) ? (_a = skillName.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null,
                            endorsementCount: (endorsementCount) ? parseInt(((_b = endorsementCount.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '0') : 0
                        };
                    });
                });
                utils_1.statusLog(logSection, `Got skills data: ${JSON.stringify(skills)}`, scraperSessionId);
                utils_1.statusLog(logSection, `Done! Returned profile details for: ${profileUrl}`, scraperSessionId);
                if (!this.options.keepAlive) {
                    utils_1.statusLog(logSection, 'Not keeping the session alive.');
                    yield this.close(page);
                    utils_1.statusLog(logSection, 'Done. Puppeteer is closed.');
                }
                else {
                    utils_1.statusLog(logSection, 'Done. Puppeteer is being kept alive in memory.');
                    yield page.close();
                }
                return {
                    userProfile,
                    experiences,
                    education,
                    volunteerExperiences,
                    skills
                };
            }
            catch (err) {
                yield this.close();
                utils_1.statusLog(logSection, 'An error occurred during a run.');
                throw err;
            }
        });
        const logSection = 'constructing';
        const errorPrefix = 'Error during setup.';
        if (!userDefinedOptions.sessionCookieValue) {
            throw new Error(`${errorPrefix} Option "sessionCookieValue" is required.`);
        }
        if (userDefinedOptions.sessionCookieValue && typeof userDefinedOptions.sessionCookieValue !== 'string') {
            throw new Error(`${errorPrefix} Option "sessionCookieValue" needs to be a string.`);
        }
        if (userDefinedOptions.userAgent && typeof userDefinedOptions.userAgent !== 'string') {
            throw new Error(`${errorPrefix} Option "userAgent" needs to be a string.`);
        }
        if (userDefinedOptions.keepAlive !== undefined && typeof userDefinedOptions.keepAlive !== 'boolean') {
            throw new Error(`${errorPrefix} Option "keepAlive" needs to be a boolean.`);
        }
        if (userDefinedOptions.timeout !== undefined && typeof userDefinedOptions.timeout !== 'number') {
            throw new Error(`${errorPrefix} Option "timeout" needs to be a number.`);
        }
        if (userDefinedOptions.headless !== undefined && typeof userDefinedOptions.headless !== 'boolean') {
            throw new Error(`${errorPrefix} Option "headless" needs to be a boolean.`);
        }
        this.options = Object.assign(this.options, userDefinedOptions);
        utils_1.statusLog(logSection, `Using options: ${JSON.stringify(this.options)}`);
    }
}
exports.LinkedInProfileScraper = LinkedInProfileScraper;
//# sourceMappingURL=index.js.map