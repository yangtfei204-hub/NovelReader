/**
 * 🐾 NovelReader Extension for SillyTavern
 * 
 * 基于精致拖拽悬浮窗与主题系统重构的小说阅读器
 */

const MODULE_NAME = 'novel_reader_ext';
let panelElement = null;
let floatBadgeElement = null;
let settingsDialogElement = null;
let helpDialogElement = null;
let importConfigDialogElement = null;
let tocDialogElement = null;

const THEMES = {
    pink:           { name: '🩷 樱花粉',     emoji: '🐾' },
    lemon:          { name: '🌼 嫩黄',       emoji: '🍋' },
    mint:           { name: '🌿 淡绿',       emoji: '🌱' },
    'glass-light':  { name: '🪟 毛玻璃白',   emoji: '☁️' },
    'glass-dark':   { name: '🕶️ 毛玻璃黑',   emoji: '🌙' },
    sakura:         { name: '🌸 夜樱',       emoji: '🌸' },
    ocean:          { name: '🌊 深海蓝',     emoji: '🐳' },
    sunset:         { name: '🌅 落日橘',     emoji: '🌇' },
    lavender:       { name: '💜 薰衣草',     emoji: '🪻' },
    mocha:          { name: '☕ 摩卡棕',     emoji: '🍫' }
};


const BADGE_DIMENSIONS = {
    large:  { w: 72, h: 76 },
    medium: { w: 58, h: 62 },
    small:  { w: 44, h: 48 }
};

const THEME_COLORS = {
    pink: {
        primary: '#ff85a7', primaryLight: '#fff0f3', primaryDeep: '#fb7299',
        secondary: '#86e3ce', bg: '#ffffff', bgSoft: '#fffbfc', text: '#5d6d7e',
        textMuted: '#b8a4ad', border: '#ff85a7', actionPrimary: '#ff85a7',
        actionPrimaryText: '#ffffff', actionSecondary: '#86e3ce',
        actionSecondaryText: '#2c3e50', shadow: 'rgba(251, 114, 153, 0.2)'
    },
    lemon: {
        primary: '#f4d35e', primaryLight: '#fff8d6', primaryDeep: '#ee9b00',
        secondary: '#ffd166', bg: '#fffdf5', bgSoft: '#fffbea', text: '#6b5d3f',
        textMuted: '#b8a87d', border: '#ee9b00', actionPrimary: '#ee9b00',
        actionPrimaryText: '#ffffff', actionSecondary: '#ffd166',
        actionSecondaryText: '#6b5d3f', shadow: 'rgba(244, 211, 94, 0.3)'
    },
    mint: {
        primary: '#95d5b2', primaryLight: '#d8f3dc', primaryDeep: '#52b788',
        secondary: '#b7e4c7', bg: '#ffffff', bgSoft: '#f1faf3', text: '#3d5a45',
        textMuted: '#8aab92', border: '#52b788', actionPrimary: '#52b788',
        actionPrimaryText: '#ffffff', actionSecondary: '#95d5b2',
        actionSecondaryText: '#3d5a45', shadow: 'rgba(82, 183, 136, 0.25)'
    },
    'glass-light': {
        primary: '#8b9bb4', primaryLight: 'rgba(255,255,255,0.5)', primaryDeep: '#5d6d7e',
        secondary: '#c9d6e2', bg: 'rgba(255,255,255,0.55)', bgSoft: 'rgba(245,248,252,0.6)',
        text: '#3d4a5c', textMuted: '#8a99ad', border: 'rgba(139,155,180,0.5)',
        actionPrimary: '#5d6d7e', actionPrimaryText: '#ffffff',
        actionSecondary: '#c9d6e2', actionSecondaryText: '#3d4a5c',
        shadow: 'rgba(100, 120, 150, 0.2)'
    },
    'glass-dark': {
        primary: '#b794d4', primaryLight: 'rgba(60,50,80,0.5)', primaryDeep: '#d4a5e8',
        secondary: '#7c9eb2', bg: 'rgba(30,25,45,0.55)', bgSoft: 'rgba(40,35,55,0.6)',
        text: '#e8e3f0', textMuted: '#9a8fb0', border: 'rgba(183,148,212,0.4)',
        actionPrimary: '#b794d4', actionPrimaryText: '#1a1525',
        actionSecondary: '#7c9eb2', actionSecondaryText: '#1a1525',
        shadow: 'rgba(0, 0, 0, 0.5)'
    },
    sakura: {
        primary: '#f8a5c2', primaryLight: 'rgba(60, 40, 55, 0.6)', primaryDeep: '#ff6b9d',
        secondary: '#c39bd3', bg: 'rgba(40, 30, 45, 0.7)', bgSoft: 'rgba(50, 38, 58, 0.65)',
        text: '#f5e6ee', textMuted: '#b094a6', border: 'rgba(248, 165, 194, 0.5)',
        actionPrimary: '#ff6b9d', actionPrimaryText: '#ffffff',
        actionSecondary: '#c39bd3', actionSecondaryText: '#2a1f15',
        shadow: 'rgba(255, 107, 157, 0.3)'
    },
    ocean: {
        primary: '#48cae4', primaryLight: '#caf0f8', primaryDeep: '#0077b6',
        secondary: '#90e0ef', bg: '#ffffff', bgSoft: '#f0fbfd', text: '#023e58',
        textMuted: '#8ab4c8', border: '#0077b6',
        actionPrimary: '#0077b6', actionPrimaryText: '#ffffff',
        actionSecondary: '#90e0ef', actionSecondaryText: '#023e58',
        shadow: 'rgba(0, 119, 182, 0.25)'
    },
    sunset: {
        primary: '#ffb07c', primaryLight: '#fff0e0', primaryDeep: '#ff7e3c',
        secondary: '#ffd6a5', bg: '#fffaf5', bgSoft: '#fff3e8', text: '#6b4423',
        textMuted: '#c4a382', border: '#ff7e3c',
        actionPrimary: '#ff7e3c', actionPrimaryText: '#ffffff',
        actionSecondary: '#ffd6a5', actionSecondaryText: '#6b4423',
        shadow: 'rgba(255, 126, 60, 0.3)'
    },
    lavender: {
        primary: '#c8a2d4', primaryLight: '#f3e5f7', primaryDeep: '#9c6bc7',
        secondary: '#e1bee7', bg: '#ffffff', bgSoft: '#faf5fc', text: '#5a4570',
        textMuted: '#b094c4', border: '#9c6bc7',
        actionPrimary: '#9c6bc7', actionPrimaryText: '#ffffff',
        actionSecondary: '#e1bee7', actionSecondaryText: '#5a4570',
        shadow: 'rgba(156, 107, 199, 0.25)'
    },
    mocha: {
        primary: '#c9a883', primaryLight: 'rgba(60, 45, 35, 0.6)', primaryDeep: '#a07855',
        secondary: '#d4b896', bg: 'rgba(45, 35, 28, 0.75)', bgSoft: 'rgba(55, 42, 33, 0.7)',
        text: '#f0e6d8', textMuted: '#a89880', border: 'rgba(201, 168, 131, 0.5)',
        actionPrimary: '#a07855', actionPrimaryText: '#ffffff',
        actionSecondary: '#d4b896', actionSecondaryText: '#2a1f15',
        shadow: 'rgba(160, 120, 85, 0.35)'
    }
};

const DEFAULT_SETTINGS = {
    theme: 'pink',
    badgeSize: 'medium',
    avatarType: 'emoji',
    avatarValue: '',
    // 🔧 改：边框纹理改为主页面背景
    mainBgImage: '',
    mainBgOpacity: 0.3,
    customColors: null,
    readerFontSize: 16,
    layoutMode: 'list',
    startAsFloating: true,
    // 🔧 阅读器自定义设置
    readerBgImage: '',
    readerBgOpacity: 0.3,
    readerBgBrightness: 1, // 🆕 新增：明暗调节（0.5-1.5）
    readerFontFamily: 'system',
    readerCustomFont: '',
    readerCustomFontUrl: '',
    readerFontImportCSS: '',
    // 📚 书籍封面自定义设置
    bookCovers: {},
    // 🆕 悬浮球头像框设置
    avatarFrame: '',
    avatarFrameType: 'none',
    avatarFrameVisible: true,
    avatarFramePosition: 'back',
    avatarFrameSize: 100,
    avatarFrameOffsetX: 0,
    avatarFrameOffsetY: 0,
    badgeEarsVisible: true,  //  猫耳外框显隐
    readerMode: 'scroll',  // 🆕 阅读模式：'scroll' 滚动 / 'paged' 推页 / 'slide' 左右翻页
    bookmarks: {},  // 🆕 书签数据：{ bookId: [{ chapterIndex, paragraphIndex, type, note, timestamp }] }
    shelfSortMode: 'addedTime',  // 🆕 排序：'addedTime' | 'title' | 'lastRead'
    readerLineHeight: 1.8,  // 🆕 行间距（1.2-3.0）
    readerParagraphSpacing: 14,  // 🆕 段间距 px（0-40）
    readingHistory: [],  // 🆕 最近阅读历史 [{ bookId, title, timestamp }]，最多5条
    enabled: false
};




const state = {
    isCollapsed: false,
    isFloating: false,
    savedHeight: '520px',
    savedWidth: '380px',
    savedPos: null,
    settings: { ...DEFAULT_SETTINGS },
    books: [],
    activeBookId: null,
    activeChapterIndex: 0,
    searchQuery: '',
    // 🆕 翻页模式运行时状态（不持久化）
    _pagedOffset: 0,
    _pagedPageHeight: 400,
    _pagedContentHeight: 0,
    _pagedTotalPages: 1,
    _pagedCurrentPage: 1
};


// ==================== IndexedDB 核心 ====================
let dbInstance = null;

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('NovelReaderDB', 3);  // 🔧 版本升级到 3
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            const oldVersion = e.oldVersion;
            
            if (oldVersion < 1 && !db.objectStoreNames.contains('chapters')) {
                db.createObjectStore('chapters', { keyPath: 'id' });
            }
            
            if (oldVersion < 2 && !db.objectStoreNames.contains('bookCovers')) {
                db.createObjectStore('bookCovers', { keyPath: 'bookId' });
            }
            
            // 🆕 版本 3: 创建 assets 表（存储背景图、字体等大文件）
            if (oldVersion < 3 && !db.objectStoreNames.contains('assets')) {
                db.createObjectStore('assets', { keyPath: 'key' });
            }
        };
        request.onsuccess = (e) => {
            dbInstance = e.target.result;
            resolve();
        };
        request.onerror = (e) => {
            console.error('IndexedDB 初始化失败:', e);
            reject(e);
        };
    });
}



function saveChapterToDB(bookId, chapterIndex, title, content) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['chapters'], 'readwrite');
        const store = transaction.objectStore('chapters');
        const data = {
            id: `${bookId}_${chapterIndex}`,
            bookId,
            chapterIndex,
            title,
            content
        };
        const req = store.put(data);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

function getChapterFromDB(bookId, chapterIndex) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['chapters'], 'readonly');
        const store = transaction.objectStore('chapters');
        const req = store.get(`${bookId}_${chapterIndex}`);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function deleteBookChaptersFromDB(bookId) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['chapters'], 'readwrite');
        const store = transaction.objectStore('chapters');
        
        const request = store.openCursor();
        const deletePromises = [];
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.bookId === bookId) {
                    deletePromises.push(cursor.delete());
                }
                cursor.continue();
            } else {
                Promise.all(deletePromises).then(resolve).catch(reject);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// ==================== 资源存储（IndexedDB） ====================

// 内存缓存：启动后从 IDB 加载到这里，避免重复读取
const assetCache = {};

/**
 * 保存大文件资源到 IndexedDB
 * @param {string} key - 资源 key，如 'main_bg', 'reader_bg', 'custom_font', 'avatar_img', 'avatar_frame'
 * @param {string} dataUrl - Base64 数据
 */
function saveAssetToDB(key, dataUrl) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        const req = store.put({ key, data: dataUrl, updatedTime: Date.now() });
        req.onsuccess = () => {
            assetCache[key] = dataUrl;  // 同步更新内存缓存
            resolve();
        };
        req.onerror = () => reject(req.error);
    });
}

/**
 * 从 IndexedDB 读取资源
 * @param {string} key - 资源 key
 * @returns {Promise<string|null>} Base64 数据
 */
function getAssetFromDB(key) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        // 优先返回内存缓存
        if (assetCache[key]) return resolve(assetCache[key]);
        const transaction = dbInstance.transaction(['assets'], 'readonly');
        const store = transaction.objectStore('assets');
        const req = store.get(key);
        req.onsuccess = () => {
            const result = req.result ? req.result.data : null;
            if (result) assetCache[key] = result;  // 放入缓存
            resolve(result);
        };
        req.onerror = () => reject(req.error);
    });
}

/**
 * 删除资源
 * @param {string} key - 资源 key
 */
function deleteAssetFromDB(key) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        const req = store.delete(key);
        req.onsuccess = () => {
            delete assetCache[key];
            resolve();
        };
        req.onerror = () => reject(req.error);
    });
}

/**
 * 启动时预加载所有 assets 到内存缓存
 */
function preloadAllAssets() {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['assets'], 'readonly');
        const store = transaction.objectStore('assets');
        const req = store.getAll();
        req.onsuccess = () => {
            const items = req.result || [];
            items.forEach(item => {
                assetCache[item.key] = item.data;
            });
            console.log(`[NovelReader] 预加载 ${items.length} 个资源到缓存`);
            resolve();
        };
        req.onerror = () => reject(req.error);
    });
}

/**
 * 解析资源值：如果是 idb: 开头就从缓存取，否则原样返回
 * @param {string} value - settings 中存的值
 * @returns {string} 实际的 dataUrl 或空字符串
 */
function resolveAsset(value) {
    if (!value) return '';
    if (value.startsWith('idb:')) {
        const key = value.substring(4);
        return assetCache[key] || '';
    }
    return value;
}

// ==================== 封面管理（IndexedDB） ====================
/**
 * 保存书籍封面到 IndexedDB
 * @param {string} bookId - 书籍 ID
 * @param {object} coverConfig - 封面配置 { type: 'image'|'text', value: string }
 */
function saveBookCoverToDB(bookId, coverConfig) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['bookCovers'], 'readwrite');
        const store = transaction.objectStore('bookCovers');
        const data = { bookId, ...coverConfig, updatedTime: Date.now() };
        const req = store.put(data);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

/**
 * 从 IndexedDB 读取书籍封面
 * @param {string} bookId - 书籍 ID
 * @returns {Promise<object|null>} 封面配置
 */
function getBookCoverFromDB(bookId) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['bookCovers'], 'readonly');
        const store = transaction.objectStore('bookCovers');
        const req = store.get(bookId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * 删除书籍封面
 * @param {string} bookId - 书籍 ID
 */
function deleteBookCoverFromDB(bookId) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['bookCovers'], 'readwrite');
        const store = transaction.objectStore('bookCovers');
        const req = store.delete(bookId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

/**
 * 🔧 旧数据迁移：将 settings.bookCovers 迁移到 IndexedDB
 */
async function migrateBookCoversToIndexedDB() {
    if (!state.settings.bookCovers || Object.keys(state.settings.bookCovers).length === 0) {
        return; // 没有旧数据，跳过
    }
    
    console.log('[NovelReader] 检测到旧版封面数据，正在迁移到 IndexedDB...');
    
    try {
        const oldCovers = state.settings.bookCovers;
        let migratedCount = 0;
        
        for (const [bookId, coverConfig] of Object.entries(oldCovers)) {
            if (coverConfig && coverConfig.type) {
                await saveBookCoverToDB(bookId, coverConfig);
                migratedCount++;
            }
        }
        
        // 迁移完成后清空 settings 中的封面数据
        state.settings.bookCovers = {};
        saveExtensionSettings();
        
        console.log(`[NovelReader] 封面数据迁移完成！共迁移 ${migratedCount} 个封面`);
    } catch (err) {
        console.error('[NovelReader] 封面迁移失败:', err);
        // 迁移失败不影响主流程，保留原数据
    }
}

/**
 * 🔧 旧数据迁移：将 settings 中的大文件迁移到 IndexedDB assets 表
 */
async function migrateAssetsToIndexedDB() {
    let migrated = false;

    // 迁移主页面背景
    if (state.settings.mainBgImage && !state.settings.mainBgImage.startsWith('idb:')) {
        try {
            await saveAssetToDB('main_bg', state.settings.mainBgImage);
            state.settings.mainBgImage = 'idb:main_bg';
            migrated = true;
        } catch (e) { console.warn('[NovelReader] 迁移主背景失败:', e); }
    }

    // 迁移阅读器背景
    if (state.settings.readerBgImage && !state.settings.readerBgImage.startsWith('idb:')) {
        try {
            await saveAssetToDB('reader_bg', state.settings.readerBgImage);
            state.settings.readerBgImage = 'idb:reader_bg';
            migrated = true;
        } catch (e) { console.warn('[NovelReader] 迁移阅读背景失败:', e); }
    }

    // 迁移字体文件
    if (state.settings.readerCustomFontUrl && state.settings.readerCustomFontUrl.startsWith('data:')) {
        try {
            await saveAssetToDB('custom_font', state.settings.readerCustomFontUrl);
            state.settings.readerCustomFontUrl = 'idb:custom_font';
            migrated = true;
        } catch (e) { console.warn('[NovelReader] 迁移字体失败:', e); }
    }

    // 迁移头像（upload 类型）
    if (state.settings.avatarType === 'upload' && state.settings.avatarValue && state.settings.avatarValue.startsWith('data:')) {
        try {
            await saveAssetToDB('avatar_img', state.settings.avatarValue);
            state.settings.avatarValue = 'idb:avatar_img';
            migrated = true;
        } catch (e) { console.warn('[NovelReader] 迁移头像失败:', e); }
    }

    // 迁移头像框
    if (state.settings.avatarFrame && state.settings.avatarFrame.startsWith('data:')) {
        try {
            await saveAssetToDB('avatar_frame', state.settings.avatarFrame);
            state.settings.avatarFrame = 'idb:avatar_frame';
            migrated = true;
        } catch (e) { console.warn('[NovelReader] 迁移头像框失败:', e); }
    }

    if (migrated) {
        saveExtensionSettings();
        console.log('[NovelReader] 大文件资源迁移完成');
    }
}

// ==================== 智能编码检测 ====================
/**
 * 智能检测文件编码并读取
 * @param {File} file - 文件对象
 * @param {Function} progressCallback - 进度回调
 * @returns {Promise<string>} 解析后的文本
 */
async function detectEncodingAndRead(file, progressCallback) {
    return new Promise((resolve, reject) => {
        const sampleSize = Math.min(file.size, 8192); // 多采样一些
        const sampleBlob = file.slice(0, sampleSize);
        const sampleReader = new FileReader();

        sampleReader.onload = async (e) => {
            const bytes = new Uint8Array(e.target.result);
            let encoding = 'UTF-8';

            // 检测 BOM
            if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
                encoding = 'UTF-8';
            } else if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
                encoding = 'UTF-16LE';
            } else if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
                encoding = 'UTF-16BE';
            } else {
                // 核心改进：验证是否为合法 UTF-8
                // 合法 UTF-8 有严格的字节模式，GBK 不符合这些模式
                if (!isValidUTF8(bytes)) {
                    encoding = 'GBK';
                }
            }

            if (progressCallback) progressCallback(0.3);

            try {
                const text = await readFileWithEncoding(file, encoding);
                if (progressCallback) progressCallback(1);
                resolve(text);
            } catch (err) {
                // 回退：两种都试，选乱码少的
                if (progressCallback) progressCallback(0.6);
                const utf8Text = await readFileWithEncoding(file, 'UTF-8');
                const gbkText = await readFileWithEncoding(file, 'GBK');

                // 统计替换字符数量
                const utf8Bad = (utf8Text.match(/\uFFFD/g) || []).length;
                const gbkBad = (gbkText.match(/\uFFFD/g) || []).length;

                if (progressCallback) progressCallback(1);
                resolve(utf8Bad <= gbkBad ? utf8Text : gbkText);
            }
        };

        sampleReader.onerror = () => reject(new Error('文件读取失败'));
        sampleReader.readAsArrayBuffer(sampleBlob);
    });
}

/**
 * 验证字节数组是否为合法 UTF-8
 * 合法 UTF-8 多字节序列有严格规则，GBK 文本几乎不可能完全符合
 */
function isValidUTF8(bytes) {
    let i = 0;
    let multiByteErrors = 0;
    let multiByteCount = 0;

    while (i < bytes.length) {
        if (bytes[i] <= 0x7F) {
            // ASCII，跳过
            i++;
        } else if ((bytes[i] & 0xE0) === 0xC0) {
            // 2 字节序列: 110xxxxx 10xxxxxx
            multiByteCount++;
            if (i + 1 >= bytes.length || (bytes[i + 1] & 0xC0) !== 0x80) {
                multiByteErrors++;
            }
            i += 2;
        } else if ((bytes[i] & 0xF0) === 0xE0) {
            // 3 字节序列: 1110xxxx 10xxxxxx 10xxxxxx（中文常见）
            multiByteCount++;
            if (i + 2 >= bytes.length ||
                (bytes[i + 1] & 0xC0) !== 0x80 ||
                (bytes[i + 2] & 0xC0) !== 0x80) {
                multiByteErrors++;
            }
            i += 3;
        } else if ((bytes[i] & 0xF8) === 0xF0) {
            // 4 字节序列
            multiByteCount++;
            if (i + 3 >= bytes.length ||
                (bytes[i + 1] & 0xC0) !== 0x80 ||
                (bytes[i + 2] & 0xC0) !== 0x80 ||
                (bytes[i + 3] & 0xC0) !== 0x80) {
                multiByteErrors++;
            }
            i += 4;
        } else {
            // 非法 UTF-8 起始字节
            multiByteErrors++;
            i++;
        }
    }

    // 如果多字节序列中错误率超过 5%，认为不是 UTF-8
    if (multiByteCount === 0) return true; // 纯 ASCII
    return (multiByteErrors / multiByteCount) < 0.05;
}


/**
 * 使用指定编码读取文件
 * @param {File} file - 文件对象
 * @param {string} encoding - 编码类型
 * @returns {Promise<string>} 文本内容
 */
function readFileWithEncoding(file, encoding) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(reader.error);
        
        if (encoding === 'GBK') {
            // GBK 需要特殊处理（浏览器不直接支持）
            const arrayReader = new FileReader();
            arrayReader.onload = (e) => {
                try {
                    const decoder = new TextDecoder('GBK');
                    const text = decoder.decode(new Uint8Array(e.target.result));
                    resolve(text);
                } catch (err) {
                    // GBK 解码失败，回退到 UTF-8
                    reader.readAsText(file, 'UTF-8');
                }
            };
            arrayReader.onerror = () => reader.readAsText(file, 'UTF-8');
            arrayReader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file, encoding);
        }
    });
}

// ==================== 美化弹窗系统 ====================
function showNovelDialog({ title, message, emoji, type, defaultValue, onConfirm, onCancel }) {
    const old = document.getElementById('novel-custom-dialog');
    if (old) old.remove();

    const isPrompt = type === 'prompt';
    const isConfirm = type === 'confirm';

    const mask = document.createElement('div');
    mask.id = 'novel-custom-dialog';
    mask.className = 'novel-dialog-mask';
    mask.setAttribute('data-novel-theme', state.settings.theme);
    mask.innerHTML = `
        <div class="novel-dialog-box" style="width:300px;max-width:88vw;">
            <div class="novel-dialog-header">
                <span>${emoji || '🐾'} ${title || '提示'}</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body" style="text-align:center;padding:20px 16px;">
                <div style="font-size:13px;color:var(--kp-text);margin-bottom:14px;line-height:1.6;">${message}</div>
                ${isPrompt ? '<input type="text" id="novel-dialog-input" class="novel-avatar-input" style="margin-bottom:12px;" value="' + escapeHtml(defaultValue || '') + '">' : ''}
                <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;">
                    ${isConfirm || isPrompt ? '<button id="novel-dialog-cancel" type="button" class="novel-action-btn-sm" style="background:var(--kp-bg-soft);color:var(--kp-text);border:2px solid var(--kp-primary-light);min-width:80px;">取消</button>' : ''}
                    <button id="novel-dialog-ok" type="button" class="novel-action-btn-sm novel-action-btn-primary" style="min-width:80px;">确定</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(mask);
    applyTheme();

    const input = mask.querySelector('#novel-dialog-input');
    if (input) {
        setTimeout(() => { input.focus(); input.select(); }, 50);
    }

    const close = (result) => {
        mask.remove();
        return result;
    };

    mask.querySelector('.novel-dialog-close').onclick = () => {
        close(null);
        if (onCancel) onCancel();
    };

    const cancelBtn = mask.querySelector('#novel-dialog-cancel');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            close(null);
            if (onCancel) onCancel();
        };
    }

    mask.querySelector('#novel-dialog-ok').onclick = () => {
        if (isPrompt) {
            const val = input.value;
            close(val);
            if (onConfirm) onConfirm(val);
        } else {
            close(true);
            if (onConfirm) onConfirm(true);
        }
    };

    if (input) {
        input.onkeydown = (e) => {
            if (e.key === 'Enter') mask.querySelector('#novel-dialog-ok').click();
        };
    }
}

function novelAlert(message, emoji) {
    return new Promise(resolve => {
        showNovelDialog({ title: '提示', message, emoji: emoji || '🐾', type: 'alert', onConfirm: resolve });
    });
}

function novelConfirm(message, emoji) {
    return new Promise(resolve => {
        showNovelDialog({ title: '确认', message, emoji: emoji || '⚠️', type: 'confirm', onConfirm: () => resolve(true), onCancel: () => resolve(false) });
    });
}

function novelPrompt(message, defaultValue, emoji) {
    return new Promise(resolve => {
        showNovelDialog({ title: '输入', message, emoji: emoji || '✏️', type: 'prompt', defaultValue, onConfirm: resolve, onCancel: () => resolve(null) });
    });
}

// ==================== 错误处理 ====================
function handleError(error, userMessage = '操作失败') {
    console.error('[NovelReader]', error);
    alert(`${userMessage}: ${error.message || error}`);
}

// ==================== 数据保存与恢复 ====================
function loadExtensionSettings() {
    try {
        const context = window.SillyTavern?.extensions_settings;
        let saved = null;
        if (context && context[MODULE_NAME]) {
            saved = context[MODULE_NAME];
        }
        if (!saved) {
            const local = localStorage.getItem(MODULE_NAME);
            if (local) {
                try { saved = JSON.parse(local); } catch (e) {}
            }
        }
        if (saved) {
            state.books = saved.books || [];
            state.savedPos = saved.lastPos || null;
            state.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
            
            // 🔧 兼容性修复：确保新字段存在（针对旧版本用户升级）
            if (!state.settings.readerCustomFontUrl) {
                state.settings.readerCustomFontUrl = '';
            }
            if (!state.settings.readerFontImportCSS) {
                state.settings.readerFontImportCSS = '';
            }
            // 🔧 新增：确保封面配置字段存在
            if (!state.settings.bookCovers) {
                state.settings.bookCovers = {};
                saveExtensionSettings();
            }
            // 🆕 头像框字段兼容
            if (state.settings.avatarFrameSize === undefined) state.settings.avatarFrameSize = 100;
            if (state.settings.avatarFrameOffsetX === undefined) state.settings.avatarFrameOffsetX = 0;
            if (state.settings.avatarFrameOffsetY === undefined) state.settings.avatarFrameOffsetY = 0;
            if (state.settings.avatarFrameVisible === undefined) state.settings.avatarFrameVisible = true;
            if (state.settings.avatarFramePosition === undefined) state.settings.avatarFramePosition = 'back';
            // 🆕 启用状态字段兼容
            if (state.settings.enabled === undefined) state.settings.enabled = false;
            // 🆕 明暗度字段兼容
            if (state.settings.readerBgBrightness === undefined) state.settings.readerBgBrightness = 1;
            // 🆕 猫耳外框显隐兼容
            if (state.settings.badgeEarsVisible === undefined) state.settings.badgeEarsVisible = true;
            // 🆕 阅读模式兼容
            if (state.settings.readerMode === undefined) state.settings.readerMode = 'scroll';
            // 🆕 书签数据兼容
            if (state.settings.bookmarks === undefined) state.settings.bookmarks = {};
            // 🆕 排序模式兼容
            if (state.settings.shelfSortMode === undefined) state.settings.shelfSortMode = 'addedTime';
            // 🆕 行间距/段间距兼容
            if (state.settings.readerLineHeight === undefined) state.settings.readerLineHeight = 1.8;
            if (state.settings.readerParagraphSpacing === undefined) state.settings.readerParagraphSpacing = 14;
            // 🆕 阅读历史兼容
            if (!Array.isArray(state.settings.readingHistory)) state.settings.readingHistory = [];

        } else {
            saveExtensionSettings();
        }
    } catch (e) {
        console.warn("[NovelReader] 配置读取失败", e);
    }
}




function saveExtensionSettings() {
    let pos = null;
    if (panelElement && !state.isFloating && panelElement.style.display !== 'none') {
        const rect = panelElement.getBoundingClientRect();
        pos = { left: rect.left, top: rect.top };
    }

    const data = {
        books: state.books,
        lastPos: pos,
        settings: state.settings
    };

    localStorage.setItem(MODULE_NAME, JSON.stringify(data));

    const context = window.SillyTavern?.extensions_settings;
    if (context) {
        context[MODULE_NAME] = data;
        window.saveSettingsDebounced?.();
    }
}

// ==================== 备份导出/导入（优化版） ====================
async function exportBackup() {
    try {
        const backupData = {
            version: '2.1.0',  // 🔧 版本号升级，表示包含 assets
            books: state.books,
            chapters: [],
            bookCovers: [],
            assets: []  // 🆕 新增：大文件资源
        };
        
        for (const book of state.books) {
            // 导出章节（原有逻辑不变）
            for (let i = 0; i < book.chaptersCount; i++) {
                const ch = await getChapterFromDB(book.id, i);
                if (ch) {
                    backupData.chapters.push({
                        bookId: book.id,
                        chapterIndex: i,
                        title: ch.title,
                        content: ch.content
                    });
                }
            }
            
            // 导出封面（原有逻辑不变）
            try {
                const cover = await getBookCoverFromDB(book.id);
                if (cover) {
                    backupData.bookCovers.push({
                        bookId: book.id,
                        type: cover.type,
                        value: cover.value
                    });
                }
            } catch (err) {
                console.warn(`[NovelReader] 导出封面失败 ${book.id}:`, err);
            }
        }

        // 🆕 导出 assets（背景图、字体、头像等大文件）
        const assetKeys = ['main_bg', 'reader_bg', 'custom_font', 'avatar_img', 'avatar_frame'];
        for (const key of assetKeys) {
            try {
                const data = await getAssetFromDB(key);
                if (data) {
                    backupData.assets.push({ key, data });
                }
            } catch (err) {
                console.warn(`[NovelReader] 导出资源 ${key} 失败:`, err);
                // 单个资源导出失败不影响整体备份
            }
        }

        // 生成下载文件
        const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `🐾萌猫小说备份_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        // 🆕 给用户一个完成提示，告知备份内容
        const assetCount = backupData.assets.length;
        console.log(`[NovelReader] 备份完成: ${state.books.length} 本书, ${backupData.chapters.length} 章节, ${backupData.bookCovers.length} 封面, ${assetCount} 个资源文件`);
    } catch (err) {
        handleError(err, '导出备份失败');
    }
}



async function importBackup(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // 基本格式校验
            if (!data.books || !data.chapters) {
                throw new Error('无效的备份文件格式');
            }
            
            const totalChapters = data.chapters.length;
            
            // ===== 1. 恢复书籍列表 =====
            for (const newBook of data.books) {
                if (!state.books.some(b => b.id === newBook.id)) {
                    state.books.push(newBook);
                }
            }
            
            // ===== 2. 批量恢复章节 =====
            const batchSize = 100;
            for (let i = 0; i < data.chapters.length; i += batchSize) {
                const batch = data.chapters.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(ch => 
                        saveChapterToDB(ch.bookId, ch.chapterIndex, ch.title, ch.content)
                    )
                );
            }

            // ===== 3. 恢复封面（原有逻辑不变） =====
            let coverCount = 0;
            if (data.bookCovers && Array.isArray(data.bookCovers)) {
                for (const cover of data.bookCovers) {
                    if (cover.bookId && cover.type) {
                        await saveBookCoverToDB(cover.bookId, {
                            type: cover.type,
                            value: cover.value
                        });
                        coverCount++;
                    }
                }
            }

            // ===== 4. 🆕 恢复 assets（背景图、字体、头像等） =====
            let assetCount = 0;
            if (data.assets && Array.isArray(data.assets)) {
                for (const asset of data.assets) {
                    if (asset.key && asset.data) {
                        try {
                            await saveAssetToDB(asset.key, asset.data);
                            assetCount++;
                        } catch (err) {
                            console.warn(`[NovelReader] 恢复资源 ${asset.key} 失败:`, err);
                        }
                    }
                }
                
                // 🔧 恢复完 assets 后，确保 settings 中的引用是正确的 idb: 格式
                // 检查备份中是否包含对应资源，如果有就把 settings 指向 idb:
                if (data.assets.some(a => a.key === 'main_bg')) {
                    state.settings.mainBgImage = 'idb:main_bg';
                }
                if (data.assets.some(a => a.key === 'reader_bg')) {
                    state.settings.readerBgImage = 'idb:reader_bg';
                }
                if (data.assets.some(a => a.key === 'custom_font')) {
                    state.settings.readerCustomFontUrl = 'idb:custom_font';
                }
                if (data.assets.some(a => a.key === 'avatar_img')) {
                    // 只有当头像类型是 upload 时才覆盖
                    if (state.settings.avatarType === 'upload') {
                        state.settings.avatarValue = 'idb:avatar_img';
                    }
                }
                if (data.assets.some(a => a.key === 'avatar_frame')) {
                    state.settings.avatarFrame = 'idb:avatar_frame';
                }
            }

            // ===== 5. 保存并刷新 =====
            saveExtensionSettings();
            applyTheme();          // 刷新主题（会触发背景重新渲染）
            applyReaderStyles();   // 刷新阅读器样式
            renderShelf();

            // 🔧 给用户详细的恢复结果
            let msg = `备份恢复成功！\n\n`;
            msg += `📚 书籍：${data.books.length} 本\n`;
            msg += `📄 章节：${totalChapters} 个\n`;
            if (coverCount > 0) msg += `🖼️ 封面：${coverCount} 个\n`;
            if (assetCount > 0) msg += `🎨 资源：${assetCount} 个（背景/字体/头像）\n`;
            alert(msg);
            
        } catch (err) {
            handleError(err, '恢复备份失败');
        }
    };
    reader.onerror = () => handleError(reader.error, '文件读取失败');
    reader.readAsText(file);
}


// ==================== 主题系统（完全隔离版） ====================
function applyTheme() {
    const theme = state.settings.theme;
    const colors = state.settings.customColors || THEME_COLORS[theme] || THEME_COLORS.pink;

    const elements = [
        panelElement, 
        floatBadgeElement, 
        settingsDialogElement, 
        helpDialogElement, 
        importConfigDialogElement, 
        tocDialogElement
    ].filter(Boolean);
    
    // 🔧 新增：也把 settings-box 内部元素纳入主题应用范围
    if (settingsDialogElement) {
        const box = settingsDialogElement.querySelector('.novel-settings-box');
        if (box) elements.push(box);
    }

    elements.forEach(el => {
        el.setAttribute('data-novel-theme', theme);
        el.style.setProperty('--kp-primary', colors.primary);
        el.style.setProperty('--kp-primary-light', colors.primaryLight);
        el.style.setProperty('--kp-primary-deep', colors.primaryDeep);
        el.style.setProperty('--kp-secondary', colors.secondary);
        el.style.setProperty('--kp-bg', colors.bg);
        el.style.setProperty('--kp-bg-soft', colors.bgSoft);
        el.style.setProperty('--kp-text', colors.text);
        el.style.setProperty('--kp-text-muted', colors.textMuted);
        el.style.setProperty('--kp-border', colors.border);
        el.style.setProperty('--kp-action-primary', colors.actionPrimary);
        el.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
        el.style.setProperty('--kp-action-secondary', colors.actionSecondary);
        el.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
        el.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
    });

    applyMainBgImage();
    updateBadgeAvatar();  // 🔧 确保头像和主题同步更新

    // 更新面板标题
    if (panelElement) {
        const titleEl = panelElement.querySelector('.novel-ext-header .title');
        if (titleEl) {
            titleEl.textContent = `${THEMES[theme].emoji} 萌猫小说阅读器 ${THEMES[theme].emoji}`;
        }
    }
}


// 🔧 新增：应用阅读器自定义样式
function applyReaderStyles() {
    const readerContent = document.getElementById('novel-reader-content');
    const readerContainer = document.getElementById('novel-reader-container');
    if (!readerContent || !readerContainer) return;

    // ========== 背景图片部分 ==========
    // 🔧 改动点：resolveAsset 解析引用
    const bgImage = resolveAsset(state.settings.readerBgImage);

    if (bgImage) {
        readerContainer.style.backgroundImage = `url("${bgImage}")`;
        readerContainer.style.backgroundSize = 'cover';
        readerContainer.style.backgroundPosition = 'center';
        readerContainer.style.backgroundRepeat = 'no-repeat';
        readerContainer.style.position = 'relative';
        
        readerContainer.style.filter = `brightness(${state.settings.readerBgBrightness || 1})`;
        
        // 添加半透明遮罩层
        let overlay = readerContainer.querySelector('.novel-reader-bg-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'novel-reader-bg-overlay';
            overlay.style.cssText = `
                position: absolute;
                inset: 0;
                background: var(--kp-bg);
                pointer-events: none;
                z-index: 0;
            `;
            readerContainer.insertBefore(overlay, readerContainer.firstChild);
        }
        overlay.style.opacity = state.settings.readerBgOpacity;
        readerContent.style.position = 'relative';
        readerContent.style.zIndex = '1';
    } else {
        readerContainer.style.backgroundImage = '';
        readerContainer.style.filter = '';
        const overlay = readerContainer.querySelector('.novel-reader-bg-overlay');
        if (overlay) overlay.remove();
    }

    // ========== 字体部分 ==========
    let fontFamily = '';
    
    switch (state.settings.readerFontFamily) {
        case 'serif':
            fontFamily = '"Songti SC", "SimSun", "宋体", serif';
            break;
        case 'sans':
            fontFamily = '"PingFang SC", "Microsoft YaHei", "微软雅黑", sans-serif';
            break;
        case 'kai':
            fontFamily = '"Kaiti SC", "KaiTi", "楷体", serif';
            break;
        case 'fang':
            fontFamily = '"STFangsong", "FangSong", "仿宋", serif';
            break;
        case 'customName':
            fontFamily = state.settings.readerCustomFont || 'inherit';
            break;
        case 'customUrl':
        case 'customUpload':
            // 🔧 改动点：resolveAsset 解析字体引用
            const fontUrl = resolveAsset(state.settings.readerCustomFontUrl);
            if (fontUrl) {
                const customFontName = 'NovelReaderCustomFont';
                fontFamily = `"${customFontName}", sans-serif`;
                
                // 删除旧的 @font-face
                const oldStyle = document.getElementById('novel-custom-font-face');
                if (oldStyle) oldStyle.remove();
                
                // 创建新的 @font-face
                const fontFaceStyle = document.createElement('style');
                fontFaceStyle.id = 'novel-custom-font-face';
                fontFaceStyle.textContent = `
                    @font-face {
                        font-family: "${customFontName}";
                        src: url("${fontUrl}");
                        font-display: swap;
                    }
                `;
                document.head.appendChild(fontFaceStyle);
            } else {
                fontFamily = 'inherit';
            }
            break;
        case 'cssImport':
            const cssImportText = state.settings.readerFontImportCSS || '';
            if (cssImportText) {
                // 从 CSS 中提取 font-family 名称
                const fontFamilyMatch = cssImportText.match(/font-family\s*:\s*["']?([^"';}\n]+)["']?\s*[;}]/i);
                const extractedFontName = fontFamilyMatch ? fontFamilyMatch[1].trim() : '';
                
                // 从 CSS 中提取 @import 语句
                const importMatch = cssImportText.match(/@import\s+url\s*\(\s*["']?([^"')]+)["']?\s*\)/i);
                
                // 删除旧的 @import style
                const oldImportStyle = document.getElementById('novel-css-import-font');
                if (oldImportStyle) oldImportStyle.remove();
                
                if (importMatch) {
                    const importStyle = document.createElement('style');
                    importStyle.id = 'novel-css-import-font';
                    importStyle.textContent = `@import url("${importMatch[1]}");`;
                    document.head.appendChild(importStyle);
                }
                
                if (extractedFontName) {
                    fontFamily = `"${extractedFontName}", sans-serif`;
                } else {
                    fontFamily = 'inherit';
                }
            } else {
                fontFamily = 'inherit';
            }
            break;
        default:
            fontFamily = 'inherit';
    }
    
    readerContent.style.fontFamily = fontFamily;

    // 🆕 应用行间距和段间距
    readerContent.style.lineHeight = String(state.settings.readerLineHeight || 1.8);
    const paragraphs = readerContent.querySelectorAll('.novel-p');
    const spacing = (state.settings.readerParagraphSpacing !== undefined ? state.settings.readerParagraphSpacing : 14) + 'px';
    paragraphs.forEach(p => { p.style.marginBottom = spacing; });
}



// 🔧 新增：应用主页面背景图片
function applyMainBgImage() {
    if (!panelElement) return;
    
    // 移除旧的背景层
    const oldLayer = panelElement.querySelector('.novel-main-bg-layer');
    if (oldLayer) oldLayer.remove();

    // 🔧 通过 resolveAsset 解析，如果是 'idb:main_bg' 会从缓存取真实 Base64
    const bgImage = resolveAsset(state.settings.mainBgImage);
    
    if (!bgImage) {
        panelElement.classList.remove('novel-has-main-bg');
        return;
    }

    panelElement.classList.add('novel-has-main-bg');

    const layer = document.createElement('div');
    layer.className = 'novel-main-bg-layer';
    layer.style.backgroundImage = `url("${bgImage}")`;
    layer.style.backgroundSize = 'cover';
    layer.style.backgroundPosition = 'center';
    layer.style.backgroundRepeat = 'no-repeat';
    layer.style.opacity = state.settings.mainBgOpacity;

    panelElement.insertBefore(layer, panelElement.firstChild);
}



function updateBadgeAvatar() {
    if (!floatBadgeElement) return;
    const circle = floatBadgeElement.querySelector('.novel-badge-circle');
    if (!circle) return;

    // 清理旧元素
    const oldFace = circle.querySelector('.novel-badge-text-face');
    const oldImg = circle.querySelector('.novel-badge-avatar-img');
    const oldFrame = circle.querySelector('.novel-badge-avatar-frame');
    if (oldImg) oldImg.remove();
    if (oldFrame) oldFrame.remove();

    const { avatarType, avatarValue, avatarFrame, avatarFrameType, avatarFrameVisible, avatarFramePosition, avatarFrameSize, avatarFrameOffsetX, avatarFrameOffsetY } = state.settings;

    // 🔧 改动点：解析头像资源引用
    const resolvedAvatarValue = resolveAsset(avatarValue);
    const resolvedAvatarFrame = resolveAsset(avatarFrame);

    // 渲染头像
    if (avatarType === 'emoji' || !resolvedAvatarValue) {
        circle.style.background = '';
        circle.style.backgroundImage = '';
        if (!oldFace) {
            const newFace = document.createElement('div');
            newFace.className = 'novel-badge-text-face';
            // emoji 类型直接用原值（不是 Base64），非 emoji 用解析后的值判断
            newFace.textContent = (avatarType === 'emoji' ? avatarValue : '') || THEMES[state.settings.theme].emoji;
            circle.appendChild(newFace);
        } else {
            oldFace.textContent = (avatarType === 'emoji' ? avatarValue : '') || THEMES[state.settings.theme].emoji;
            oldFace.style.display = '';
        }
    } else if (avatarType === 'url' || avatarType === 'upload') {
        if (oldFace) oldFace.style.display = 'none';
        const img = document.createElement('img');
        img.className = 'novel-badge-avatar-img';
        img.src = resolvedAvatarValue;  // 🔧 用解析后的值
        img.alt = 'avatar';
        img.onerror = () => {
            img.remove();
            if (oldFace) {
                oldFace.style.display = '';
                oldFace.textContent = THEMES[state.settings.theme].emoji;
            }
        };
        circle.appendChild(img);
    }

    // 渲染头像框
    if (avatarFrameVisible && resolvedAvatarFrame && (avatarFrameType === 'url' || avatarFrameType === 'upload')) {
        const frame = document.createElement('img');
        frame.className = 'novel-badge-avatar-frame';
        frame.src = resolvedAvatarFrame;  // 🔧 用解析后的值
        frame.alt = 'frame';
        frame.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(calc(-50% + ${avatarFrameOffsetX || 0}px), calc(-50% + ${avatarFrameOffsetY || 0}px));
            width: ${avatarFrameSize || 100}%;
            height: ${avatarFrameSize || 100}%;
            pointer-events: none;
            z-index: ${avatarFramePosition === 'front' ? '10' : '-1'};
            object-fit: contain;
        `;
        frame.onerror = () => frame.remove();
        circle.appendChild(frame);
    }

    // 猫耳外框显隐
    const earLeft = floatBadgeElement.querySelector('.novel-badge-ear.left');
    const earRight = floatBadgeElement.querySelector('.novel-badge-ear.right');
    const showEars = state.settings.badgeEarsVisible !== false;
    if (earLeft) earLeft.style.display = showEars ? '' : 'none';
    if (earRight) earRight.style.display = showEars ? '' : 'none';
    if (showEars) {
        circle.style.borderWidth = '';
    } else {
        circle.style.borderWidth = '0px';
    }

    floatBadgeElement.setAttribute('data-novel-theme', state.settings.theme);
}



// ==================== 自动切章算法（大文件优化版）====================
function executeSplit(text, options) {
    const chapters = [];
    const { method, regexPattern, wordCount } = options;

    // 大文件阈值：超过 3MB 启用流式处理路径
    const LARGE_FILE_THRESHOLD = 3 * 1024 * 1024; // 3MB（字符数约等于字节数）
    const isLargeFile = text.length > LARGE_FILE_THRESHOLD;

    if (method === 'regex') {
        let regex;
        try {
            regex = new RegExp(regexPattern, 'g');
        } catch (e) {
            // 正则非法，退化为单章
            chapters.push({ title: '全文（正则无效）', content: text });
            return chapters;
        }

        if (isLargeFile) {
            // ===== 大文件：流式扫描，不预存 matches 数组 =====
            // 直接在扫描过程中切割章节，每次只保留「上一个章节头」的位置
            let prevIndex = -1;
            let prevTitle = '';
            let hasMatch = false;
            let match;

            // 重置正则状态
            regex.lastIndex = 0;

            while ((match = regex.exec(text)) !== null) {
                const currentIndex = match.index;
                const currentTitle = match[0].trim();

                if (!hasMatch) {
                    // 第一个匹配：如果前面有内容，作为前言
                    if (currentIndex > 0) {
                        chapters.push({
                            title: '前言',
                            // 直接截取，不缓存
                            content: text.substring(0, currentIndex).trim()
                        });
                    }
                    hasMatch = true;
                } else {
                    // 把上一章的内容截取出来（从上一个标题结束到当前标题开始）
                    const contentStart = prevIndex + prevTitle.length;
                    chapters.push({
                        title: prevTitle,
                        content: text.substring(contentStart, currentIndex).trim()
                    });
                }

                prevIndex = currentIndex;
                prevTitle = currentTitle;

                // 防止零宽匹配死循环
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
            }

            // 处理最后一章
            if (hasMatch) {
                const contentStart = prevIndex + prevTitle.length;
                chapters.push({
                    title: prevTitle,
                    content: text.substring(contentStart).trim()
                });
            } else {
                // 全文没有匹配到章节标题
                chapters.push({ title: '第一章', content: text });
            }

        } else {
            // ===== 小文件：原有逻辑，简单可靠 =====
            const matches = [];
            let match;
            regex.lastIndex = 0;

            while ((match = regex.exec(text)) !== null) {
                matches.push({ index: match.index, title: match[0].trim() });
                // 防止零宽匹配死循环
                if (match.index === regex.lastIndex) regex.lastIndex++;
            }

            if (matches.length === 0) {
                chapters.push({ title: '第一章', content: text });
            } else {
                if (matches[0].index > 0) {
                    chapters.push({ title: '前言', content: text.substring(0, matches[0].index).trim() });
                }
                for (let i = 0; i < matches.length; i++) {
                    const start = matches[i].index;
                    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
                    const content = text.substring(start + matches[i].title.length, end).trim();
                    chapters.push({ title: matches[i].title, content });
                }
            }
        }

    } else if (method === 'wordCount') {
        const size = Math.max(100, parseInt(wordCount) || 5000);
        let index = 0;
        let chIdx = 1;

        while (index < text.length) {
            // 🔧 修复：substr 已废弃，改用 substring
            const content = text.substring(index, index + size);
            chapters.push({ title: `第 ${chIdx} 部分`, content });
            index += size;
            chIdx++;
        }

    } else if (method === 'newlines') {
        if (isLargeFile) {
            // ===== 大文件：逐字符流式扫描，避免 split 产生巨大行数组 =====
            let lineStart = 0;
            let chTitle = '前言';
            let chunkStart = 0; // 当前章节内容起始位置

            // 用一个轻量状态机逐行处理
            // 不 split，而是手动找换行符
            const len = text.length;
            let i = 0;

            // 判断一行是否是章节标题的轻量检测
            const looksLikeTitle = (line) => {
                const t = line.trim();
                return (
                    t.length > 0 &&
                    t.length < 40 &&
                    (
                        t.startsWith('第') ||
                        /^\d{1,4}$/.test(t) ||
                        /^Chapter\s*\d/i.test(t) ||
                        t.includes('章节') ||
                        t.includes('番外') ||
                        t.includes('序章') ||
                        t.includes('尾声')
                    )
                );
            };

            while (i <= len) {
                // 找到换行符或文件末尾
                if (i === len || text[i] === '\n') {
                    const lineEnd = (i > 0 && text[i - 1] === '\r') ? i - 1 : i;
                    const line = text.substring(lineStart, lineEnd);

                    if (looksLikeTitle(line)) {
                        // 把上一章内容存入（从 chunkStart 到当前行开始）
                        const content = text.substring(chunkStart, lineStart).trim();
                        if (content.length > 0 || chapters.length > 0) {
                            chapters.push({ title: chTitle, content });
                        }
                        chTitle = line.trim();
                        chunkStart = i + 1; // 新章节内容从下一行开始
                    }

                    lineStart = i + 1;
                }
                i++;
            }

            // 处理最后一章
            const lastContent = text.substring(chunkStart).trim();
            if (lastContent.length > 0 || chapters.length === 0) {
                chapters.push({ title: chTitle, content: lastContent });
            }

        } else {
            // ===== 小文件：原有逻辑 =====
            const lines = text.split(/\r?\n/);
            let chTitle = '前言';
            let chContent = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (
                    line.length > 0 &&
                    line.length < 30 &&
                    (
                        line.startsWith('第') ||
                        /^\d+$/.test(line) ||
                        line.includes('Chapter') ||
                        line.includes('章节')
                    )
                ) {
                    if (chContent.length > 0) {
                        chapters.push({ title: chTitle, content: chContent.join('\n') });
                        chContent = [];
                    }
                    chTitle = line;
                } else {
                    chContent.push(lines[i]);
                }
            }

            if (chContent.length > 0 || chapters.length === 0) {
                chapters.push({ title: chTitle, content: chContent.join('\n') });
            }
        }

    } else {
        // method === 'none'
        chapters.push({ title: '全文', content: text });
    }

    return chapters;
}


// ==================== 图片压缩工具 ====================
/**
 * 压缩图片到指定尺寸和质量
 * @param {File} file - 原始图片文件
 * @param {number} maxWidth - 最大宽度（默认 300）
 * @param {number} maxHeight - 最大高度（默认 400）
 * @param {number} quality - 压缩质量 0-1（默认 0.8）
 * @param {Function} callback - 回调函数，返回压缩后的 Base64
 */
function compressImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 计算压缩后的尺寸（保持宽高比）
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            
            // 创建 canvas 进行压缩
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // 使用高质量缩放算法
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            // 转换为 JPEG 格式（更小的文件体积）
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // 计算压缩后的大小（KB）
            const originalSizeKB = (file.size / 1024).toFixed(1);
            const compressedSizeKB = ((compressedDataUrl.length * 0.75) / 1024).toFixed(1);
            
            console.log(`[NovelReader] 封面压缩：${originalSizeKB}KB → ${compressedSizeKB}KB (${width}×${height})`);
            
            // 如果压缩后仍然较大，给出警告
            if (compressedSizeKB > 500) {
                alert(`⚠️ 压缩后图片仍较大（${compressedSizeKB}KB）\n可能影响性能，建议使用更小的图片。`);
            }
            
            callback(compressedDataUrl);
        };
        img.onerror = () => {
            alert('图片加载失败，请选择有效的图片文件。');
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        alert('文件读取失败，请重试。');
    };
    reader.readAsDataURL(file);
}

// ==================== 阅读历史 ====================
function renderReadingHistory() {
    const bar = document.getElementById('novel-history-bar');
    if (!bar) return;

    const history = state.settings.readingHistory || [];
    // 只显示书架中仍存在的书
    const validHistory = history.filter(h => state.books.some(b => b.id === h.bookId));

    if (validHistory.length === 0) {
        bar.style.display = 'none';
        return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = '<span class="novel-history-label">📖 最近</span>' +
        validHistory.map(h => `<span class="novel-history-chip" data-book-id="${h.bookId}" title="${escapeHtml(h.title)}">${escapeHtml(h.title)}</span>`).join('');

    bar.querySelectorAll('.novel-history-chip').forEach(chip => {
        chip.onclick = () => {
            const bookId = chip.dataset.bookId;
            openReader(bookId);
        };
    });
}



// ==================== 渲染书架 ====================
function renderShelf() {
    const container = document.getElementById('novel-shelf-container');
    if (!container) return;
    container.innerHTML = '';

    const layout = state.settings.layoutMode || 'list';
    container.className = `novel-shelf-${layout}`;

    const query = state.searchQuery.trim().toLowerCase();
    let filteredBooks = state.books.filter(b => b.title.toLowerCase().includes(query));

    // 🆕 排序
    const sortMode = state.settings.shelfSortMode || 'addedTime';
    if (sortMode === 'title') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
    } else if (sortMode === 'lastRead') {
        filteredBooks.sort((a, b) => (b.lastReadTime || b.addedTime || 0) - (a.lastReadTime || a.addedTime || 0));
    } else {
        filteredBooks.sort((a, b) => (b.addedTime || 0) - (a.addedTime || 0));
    }

    if (filteredBooks.length === 0) {
        container.innerHTML = `<div class="novel-empty-tip">书架上还没有书噢，赶紧导入吧~</div>`;
        return;
    }

    filteredBooks.forEach(book => {
        const item = document.createElement('div');
        item.className = 'novel-book-card';

        let displayTitle = book.title;
        if (query) {
            const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
            displayTitle = book.title.replace(regex, '<mark class="novel-search-highlight">\$1</mark>');
        }

        // 🔧 先用默认渐变色渲染，封面异步加载后再更新
        const coverColor = getHashColor(book.id);
        const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

        item.innerHTML = `
            <div class="novel-book-cover" style="background: ${coverColor};" title="${isMobile ? '点击阅读 · 长按编辑封面' : '左键阅读 · 右键编辑封面'}">
                <div class="novel-cover-inner">📖</div>
            </div>
            <div class="novel-book-info">
                <div class="novel-book-title-wrap">
                    <span class="novel-book-title" title="点击阅读 · 双击修改">${displayTitle}</span>
                </div>
                <div class="novel-book-progress">读至第 ${book.currentChapter + 1}/${book.chaptersCount} 章</div>
                <div class="novel-book-actions">
                    <button class="novel-btn-sm rename-btn" type="button">改名</button>
                    <button class="novel-btn-sm del-btn" type="button">删除</button>
                </div>
            </div>
        `;

        // 🔧 异步加载封面（IndexedDB 优先，兼容旧 settings 数据）
        const coverEl = item.querySelector('.novel-book-cover');
        (async () => {
            try {
                let coverConfig = null;

                // 优先从 IndexedDB 读取
                coverConfig = await getBookCoverFromDB(book.id);

                // IndexedDB 没有则兼容读取旧版 settings 中的数据
                if (!coverConfig && state.settings.bookCovers?.[book.id]) {
                    coverConfig = state.settings.bookCovers[book.id];
                }

                if (!coverConfig) return; // 没有封面配置，保持默认渐变

                if (coverConfig.type === 'image' && coverConfig.value) {
                    // 图片封面
                    coverEl.style.backgroundImage = `url('${coverConfig.value}')`;
                    coverEl.style.backgroundSize = 'cover';
                    coverEl.style.backgroundPosition = 'center';
                    coverEl.style.backgroundRepeat = 'no-repeat';
                    coverEl.style.background = '';  // 清除渐变色
                    coverEl.innerHTML = '';          // 清除占位图标
                } else if (coverConfig.type === 'text' && coverConfig.value) {
                    // 文字封面（保留渐变背景，替换内容）
                    coverEl.innerHTML = `<div class="novel-cover-text">${escapeHtml(coverConfig.value)}</div>`;
                }
            } catch (err) {
                console.warn(`[NovelReader] 读取封面失败 ${book.id}:`, err);
                // 读取失败静默处理，保持默认渐变
            }
        })();

        // 🔧 封面交互：桌面端右键，移动端长按
        if (isMobile) {
            let longPressTimer = null;
            let isLongPress = false;

            coverEl.addEventListener('touchstart', (e) => {
                isLongPress = false;
                longPressTimer = setTimeout(() => {
                    isLongPress = true;
                    e.preventDefault();
                    const touch = e.touches[0];
                    if (navigator.vibrate) navigator.vibrate(50);
                    openCoverEditMenu(book.id, {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    });
                }, 500);
            });

            coverEl.addEventListener('touchend', () => {
                if (longPressTimer) clearTimeout(longPressTimer);
                if (!isLongPress) {
                    openReader(book.id);
                }
            });

            coverEl.addEventListener('touchmove', () => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            });
        } else {
            coverEl.onclick = () => openReader(book.id);
            coverEl.oncontextmenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openCoverEditMenu(book.id, e);
            };
        }

        item.querySelector('.novel-book-title').onclick = () => openReader(book.id);

        item.querySelector('.novel-book-title').ondblclick = (e) => {
            e.stopPropagation();
            renameBook(book.id);
        };

        item.querySelector('.rename-btn').onclick = (e) => {
            e.stopPropagation();
            renameBook(book.id);
        };

        item.querySelector('.del-btn').onclick = async (e) => {
            e.stopPropagation();
            const confirmed = await novelConfirm(`确定要彻底删除《${book.title}》吗？<br>这将不可恢复！`, '🗑️');
            if (confirmed) {
                try {
                    await deleteBookChaptersFromDB(book.id);
                    // 🔧 同时删除 IndexedDB 中的封面
                    await deleteBookCoverFromDB(book.id);

                    state.books = state.books.filter(b => b.id !== book.id);

                    // 兼容：清理 settings 中的旧版封面遗留数据
                    if (state.settings.bookCovers?.[book.id]) {
                        delete state.settings.bookCovers[book.id];
                    }

                    saveExtensionSettings();
                    renderShelf();
                } catch (err) {
                    handleError(err, '删除失败');
                }
            }
        };

        container.appendChild(item);
    });

    // 🆕 同步更新历史栏
    renderReadingHistory();
}






function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getHashColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    ];
    return colors[Math.abs(hash) % colors.length];
}

// ==================== 阅读器 ====================
async function openReader(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;

    state.activeBookId = bookId;
    state.activeChapterIndex = book.currentChapter || 0;
    book.lastReadTime = Date.now();

    // 🆕 记录阅读历史（最多5条，去重）
    if (!state.settings.readingHistory) state.settings.readingHistory = [];
    state.settings.readingHistory = state.settings.readingHistory.filter(h => h.bookId !== bookId);
    state.settings.readingHistory.unshift({ bookId, title: book.title, timestamp: Date.now() });
    if (state.settings.readingHistory.length > 5) state.settings.readingHistory = state.settings.readingHistory.slice(0, 5);

    saveExtensionSettings();

    document.getElementById('novel-shelf-view').style.display = 'none';
    const readerView = document.getElementById('novel-reader-view');
    readerView.style.display = 'flex';

    await renderActiveChapter();
}

async function renderActiveChapter() {
    const book = state.books.find(b => b.id === state.activeBookId);
    if (!book) return;

    try {
        const chapterData = await getChapterFromDB(state.activeBookId, state.activeChapterIndex);
        const contentBox = document.getElementById('novel-reader-content');
        const headerTitle = document.getElementById('novel-reader-chapter-title');

        if (!chapterData) {
            contentBox.innerHTML = '<p class="novel-error">章节内容加载失败，已被移除或尚未就绪。</p>';
            return;
        }
        headerTitle.textContent = chapterData.title;
        
        const paragraphs = chapterData.content.split(/\r?\n/).filter(p => p.trim());
        contentBox.innerHTML = paragraphs.map(p => `<p class="novel-p">${escapeHtml(p)}</p>`).join('');

        // 🆕 翻页模式下把标题移入内容区，随内容一起偏移
        const mode = state.settings.readerMode;
        if (mode === 'paged' || mode === 'slide') {
            headerTitle.style.display = 'none';
            // 在内容顶部插入标题段落
            const titleP = document.createElement('div');
            titleP.id = 'novel-reader-inline-title';
            titleP.style.cssText = 'font-size:18px;font-weight:bold;color:var(--kp-primary-deep);border-bottom:2px dashed var(--kp-primary-light);padding-bottom:8px;margin-bottom:12px;text-align:center;';
            titleP.textContent = chapterData.title;
            contentBox.insertBefore(titleP, contentBox.firstChild);
        } else {
            headerTitle.style.display = '';
        }
        contentBox.scrollTop = 0;

        book.currentChapter = state.activeChapterIndex;
        saveExtensionSettings();
        
        // 🔧 新增：应用阅读器自定义样式
        applyReaderStyles();

        // 🆕 应用阅读模式（翻页/滚动）并更新进度
        setTimeout(() => {
            applyReaderMode();
            updateReadingProgress();
            renderBookmarkDecorations();
        }, 50);

    } catch (err) {
        handleError(err, '章节加载失败');
    }
}


// ==================== 阅读进度 ====================
function updateReadingProgress() {
    const container = document.getElementById('novel-reader-container');
    const progressFill = document.getElementById('novel-progress-fill');
    const progressText = document.getElementById('novel-progress-text');
    if (!container || !progressFill || !progressText) return;

    const book = state.books.find(b => b.id === state.activeBookId);
    if (!book) return;

    // 当前章节进度
    let chapterPercent = 0;
    if (state.settings.readerMode === 'paged' || state.settings.readerMode === 'slide') {
        // 翻页模式：用当前页/总页数
        const totalPages = state._pagedTotalPages || 1;
        const currentPage = state._pagedCurrentPage || 1;
        chapterPercent = Math.round((currentPage / totalPages) * 100);
    } else {
        // 滚动模式：用 scrollTop
        const scrollHeight = container.scrollHeight - container.clientHeight;
        if (scrollHeight > 0) {
            chapterPercent = Math.round((container.scrollTop / scrollHeight) * 100);
        } else {
            chapterPercent = 100;
        }
    }

    // 全书进度 = (已读完整章 + 当前章节进度) / 总章数
    const bookPercent = Math.round(((state.activeChapterIndex + chapterPercent / 100) / book.chaptersCount) * 100);

    progressFill.style.width = chapterPercent + '%';
    progressText.textContent = `本章 ${chapterPercent}% · 全书 ${bookPercent}%`;
}

// ==================== 翻页模式 ====================
function applyReaderMode() {
    const container = document.getElementById('novel-reader-container');
    const content = document.getElementById('novel-reader-content');
    const modeBtn = document.getElementById('novel-menu-mode-toggle');
    if (!container || !content) return;

    // 清理旧的翻页元素
    const oldIndicator = container.querySelector('.novel-page-indicator');
    if (oldIndicator) oldIndicator.remove();
    const oldTapLeft = container.querySelector('.novel-page-tap-left');
    if (oldTapLeft) oldTapLeft.remove();
    const oldTapRight = container.querySelector('.novel-page-tap-right');
    if (oldTapRight) oldTapRight.remove();

    const mode = state.settings.readerMode;

    if (mode === 'paged' || mode === 'slide') {
        // 进入翻页模式（推页或左右翻）
        container.classList.add('novel-paged-mode');
        container.style.overflowY = 'hidden';
        if (modeBtn) {
            if (mode === 'paged') modeBtn.textContent = '📄 推页';
            else modeBtn.textContent = '📖 左右翻';
        }

        // 计算分页
        const containerHeight = container.clientHeight - 28;
        state._pagedOffset = 0;
        state._pagedPageHeight = containerHeight;
        state._pagedTotalPages = Math.max(1, Math.ceil(content.scrollHeight / containerHeight));
        state._pagedCurrentPage = 1;

        // 应用初始位置
        container.scrollTop = 0;
        content.style.transition = 'none';
        content.style.transform = 'translateX(0) translateY(0)';

        // 添加翻页指示器
        const indicator = document.createElement('div');
        indicator.className = 'novel-page-indicator';
        indicator.id = 'novel-page-indicator';
        indicator.textContent = `1 / ${state._pagedTotalPages}`;
        container.appendChild(indicator);

        // 添加左右点击区域
        const tapLeft = document.createElement('div');
        tapLeft.className = 'novel-page-tap-left';
        tapLeft.onclick = (e) => { e.stopPropagation(); pagedPrev(); };
        container.appendChild(tapLeft);

        const tapRight = document.createElement('div');
        tapRight.className = 'novel-page-tap-right';
        tapRight.onclick = (e) => { e.stopPropagation(); pagedNext(); };
        container.appendChild(tapRight);

        updateReadingProgress();
    } else {
        // 回到滚动模式
        container.classList.remove('novel-paged-mode');
        container.style.overflowY = 'auto';
        content.style.transform = '';
        if (modeBtn) modeBtn.textContent = '📜 滚动';

        state._pagedOffset = 0;
        state._pagedCurrentPage = 1;
        state._pagedTotalPages = 1;

        updateReadingProgress();
    }
}


function pagedNext() {
    const content = document.getElementById('novel-reader-content');
    const container = document.getElementById('novel-reader-container');
    if (!content || !container) return;

    const maxOffset = content.scrollHeight - (container.clientHeight - 28);
    if (state._pagedOffset >= maxOffset) {
        const book = state.books.find(b => b.id === state.activeBookId);
        if (book && state.activeChapterIndex < book.chaptersCount - 1) {
            state.activeChapterIndex++;
            renderActiveChapter();
        } else {
            novelAlert('已经是最后一页了！', '📖');
        }
        return;
    }

    const newOffset = Math.min(state._pagedOffset + state._pagedPageHeight, maxOffset);
    state._pagedCurrentPage = Math.min(state._pagedCurrentPage + 1, state._pagedTotalPages);

    if (state.settings.readerMode === 'slide') {
        // 左右翻页：当前页滑出到左侧
        content.style.transition = 'transform 0.25s ease-in';
        content.style.transform = `translateX(-100%) translateY(-${state._pagedOffset}px)`;
        setTimeout(() => {
            // 瞬间移到右侧 + 设置新偏移
            content.style.transition = 'none';
            state._pagedOffset = newOffset;
            content.style.transform = `translateX(100%) translateY(-${state._pagedOffset}px)`;
            // 强制重排
            void content.offsetHeight;
            // 从右侧滑入到中间
            content.style.transition = 'transform 0.25s ease-out';
            content.style.transform = `translateX(0) translateY(-${state._pagedOffset}px)`;
            // 动画结束后更新进度
            setTimeout(() => { updateReadingProgress(); }, 260);
        }, 260);
    } else {
        // 推页模式
        state._pagedOffset = newOffset;
        content.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        content.style.transform = `translateY(-${state._pagedOffset}px)`;
        updateReadingProgress();
    }
    const indicator = document.getElementById('novel-page-indicator');
    if (indicator) indicator.textContent = `${state._pagedCurrentPage} / ${state._pagedTotalPages}`;
}

function pagedPrev() {
    const content = document.getElementById('novel-reader-content');
    if (!content) return;

    if (state._pagedOffset <= 0) {
        if (state.activeChapterIndex > 0) {
            state.activeChapterIndex--;
            renderActiveChapter().then(() => {
                if (state.settings.readerMode === 'paged' || state.settings.readerMode === 'slide') {
                    goToLastPage();
                }
            });
        } else {
            novelAlert('已经是第一页了！', '📖');
        }
        return;
    }

    const newOffset = Math.max(0, state._pagedOffset - state._pagedPageHeight);
    state._pagedCurrentPage = Math.max(1, state._pagedCurrentPage - 1);

    if (state.settings.readerMode === 'slide') {
        // 左右翻页：当前页滑出到右侧
        content.style.transition = 'transform 0.25s ease-in';
        content.style.transform = `translateX(100%) translateY(-${state._pagedOffset}px)`;
        setTimeout(() => {
            // 瞬间移到左侧 + 设置新偏移
            content.style.transition = 'none';
            state._pagedOffset = newOffset;
            content.style.transform = `translateX(-100%) translateY(-${state._pagedOffset}px)`;
            void content.offsetHeight;
            // 从左侧滑入到中间
            content.style.transition = 'transform 0.25s ease-out';
            content.style.transform = `translateX(0) translateY(-${state._pagedOffset}px)`;
            setTimeout(() => { updateReadingProgress(); }, 260);
        }, 260);
    } else {
        // 推页模式
        state._pagedOffset = newOffset;
        content.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        content.style.transform = `translateY(-${state._pagedOffset}px)`;
        updateReadingProgress();
    }
    const indicator = document.getElementById('novel-page-indicator');
    if (indicator) indicator.textContent = `${state._pagedCurrentPage} / ${state._pagedTotalPages}`;
}

function goToLastPage() {
    const content = document.getElementById('novel-reader-content');
    const container = document.getElementById('novel-reader-container');
    if (!content || !container) return;

    const maxOffset = content.scrollHeight - (container.clientHeight - 28);
    state._pagedOffset = Math.max(0, maxOffset);
    state._pagedTotalPages = Math.max(1, Math.ceil(content.scrollHeight / state._pagedPageHeight));
    state._pagedCurrentPage = state._pagedTotalPages;

    content.style.transition = 'none';
    content.style.transform = `translateX(0) translateY(-${state._pagedOffset}px)`;

    const indicator = document.getElementById('novel-page-indicator');
    if (indicator) indicator.textContent = `${state._pagedCurrentPage} / ${state._pagedTotalPages}`;
    updateReadingProgress();
}

// ==================== 键盘快捷键 ====================
function handleReaderKeyboard(e) {
    // 只在阅读器视图可见时响应
    const readerView = document.getElementById('novel-reader-view');
    if (!readerView || readerView.style.display === 'none') return;
    // 不在输入框中时才响应
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    // 有弹窗打开时不响应
    if (document.querySelector('.novel-dialog-mask')) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            if (state.activeChapterIndex > 0) {
                state.activeChapterIndex--;
                renderActiveChapter();
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            const book = state.books.find(b => b.id === state.activeBookId);
            if (book && state.activeChapterIndex < book.chaptersCount - 1) {
                state.activeChapterIndex++;
                renderActiveChapter();
            }
            break;
            case ' ':
                e.preventDefault();
                if (state.settings.readerMode === 'paged' || state.settings.readerMode === 'slide') {
                    pagedNext();
            } else {
                const container = document.getElementById('novel-reader-container');
                if (container) {
                    container.scrollBy({ top: container.clientHeight * 0.85, behavior: 'smooth' });
                }
            }
            break;
        case 'Escape':
            e.preventDefault();
            quitReader();
            break;
    }
}

// ==================== 书签/标注系统 ====================
function getBookBookmarks(bookId) {
    if (!state.settings.bookmarks) state.settings.bookmarks = {};
    return state.settings.bookmarks[bookId] || [];
}

function saveBookmark(bookId, bookmark) {
    if (!state.settings.bookmarks) state.settings.bookmarks = {};
    if (!state.settings.bookmarks[bookId]) state.settings.bookmarks[bookId] = [];
    state.settings.bookmarks[bookId].push(bookmark);
    saveExtensionSettings();
}

function removeBookmark(bookId, timestamp) {
    if (!state.settings.bookmarks || !state.settings.bookmarks[bookId]) return;
    state.settings.bookmarks[bookId] = state.settings.bookmarks[bookId].filter(b => b.timestamp !== timestamp);
    if (state.settings.bookmarks[bookId].length === 0) {
        delete state.settings.bookmarks[bookId];
    }
    saveExtensionSettings();
}

function setupBookmarkInteractions() {
    const contentBox = document.getElementById('novel-reader-content');
    if (!contentBox) return;

    let longPressTimer = null;
    let longPressTarget = null;

    // 桌面端：右键段落
    contentBox.addEventListener('contextmenu', (e) => {
        const p = e.target.closest('.novel-p');
        if (!p) return;
        e.preventDefault();
        e.stopPropagation();
        const pIndex = Array.from(contentBox.querySelectorAll('.novel-p')).indexOf(p);
        openBookmarkMenu(p, pIndex, e.clientX, e.clientY);
    });

    // 移动端：长按段落
    contentBox.addEventListener('touchstart', (e) => {
        const p = e.target.closest('.novel-p');
        if (!p) return;
        longPressTarget = p;
        longPressTimer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate(30);
            p.classList.add('novel-longpress-active');
            const pIndex = Array.from(contentBox.querySelectorAll('.novel-p')).indexOf(p);
            const touch = e.touches[0];
            openBookmarkMenu(p, pIndex, touch.clientX, touch.clientY);
        }, 600);
    });

    contentBox.addEventListener('touchend', () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        if (longPressTarget) longPressTarget.classList.remove('novel-longpress-active');
        longPressTarget = null;
    });

    contentBox.addEventListener('touchmove', () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        if (longPressTarget) longPressTarget.classList.remove('novel-longpress-active');
        longPressTarget = null;
    });
}

function openBookmarkMenu(pElement, pIndex, clientX, clientY) {
    // 移除旧菜单
    const oldMenu = document.querySelector('.novel-bookmark-menu');
    if (oldMenu) oldMenu.remove();

    const bookId = state.activeBookId;
    const chapterIndex = state.activeChapterIndex;
    const bookmarks = getBookBookmarks(bookId);
    const existing = bookmarks.find(b => b.chapterIndex === chapterIndex && b.paragraphIndex === pIndex);

    const menu = document.createElement('div');
    menu.className = 'novel-bookmark-menu';
    menu.setAttribute('data-novel-theme', state.settings.theme);
    menu.style.left = clientX + 'px';
    menu.style.top = clientY + 'px';

    if (existing) {
        menu.innerHTML = `
            <div class="novel-menu-item-ctx" data-action="remove">🗑️ 移除书签</div>
            <div class="novel-menu-item-ctx" data-action="edit-note">📝 编辑笔记</div>
            <div class="novel-menu-item-ctx" data-action="toggle-highlight">${existing.type === 'highlight' ? '✖ 取消高亮' : '🖍️ 高亮标注'}</div>
        `;
    } else {
        menu.innerHTML = `
            <div class="novel-menu-item-ctx" data-action="add-bookmark">🔖 添加书签</div>
            <div class="novel-menu-item-ctx" data-action="add-highlight">🖍️ 高亮标注</div>
            <div class="novel-menu-item-ctx" data-action="add-note">📝 书签+笔记</div>
        `;
    }

    document.body.appendChild(menu);

    // 确保菜单不超出屏幕
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
    if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 10) + 'px';

    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', function closeBookmarkMenu(ev) {
            if (!menu.contains(ev.target)) {
                menu.remove();
                document.removeEventListener('click', closeBookmarkMenu);
            }
        });
    }, 50);

    // 菜单项事件
    menu.querySelectorAll('.novel-menu-item-ctx').forEach(item => {
        item.onclick = () => {
            const action = item.dataset.action;
            menu.remove();
            const textPreview = pElement.textContent.substring(0, 50);

            if (action === 'add-bookmark') {
                saveBookmark(bookId, {
                    chapterIndex,
                    paragraphIndex: pIndex,
                    type: 'bookmark',
                    note: '',
                    text: textPreview,
                    timestamp: Date.now()
                });
                renderBookmarkDecorations();
            } else if (action === 'add-highlight') {
                saveBookmark(bookId, {
                    chapterIndex,
                    paragraphIndex: pIndex,
                    type: 'highlight',
                    note: '',
                    text: textPreview,
                    timestamp: Date.now()
                });
                renderBookmarkDecorations();
            } else if (action === 'add-note') {
                novelPrompt('请输入笔记内容：', '', '📝').then(note => {
                    if (note !== null) {
                        saveBookmark(bookId, {
                            chapterIndex,
                            paragraphIndex: pIndex,
                            type: 'bookmark',
                            note: note.trim(),
                            text: textPreview,
                            timestamp: Date.now()
                        });
                        renderBookmarkDecorations();
                    }
                });
            } else if (action === 'remove') {
                removeBookmark(bookId, existing.timestamp);
                renderBookmarkDecorations();
            } else if (action === 'edit-note') {
                novelPrompt('编辑笔记：', existing.note || '', '📝').then(note => {
                    if (note !== null) {
                        existing.note = note.trim();
                        saveExtensionSettings();
                        renderBookmarkDecorations();
                    }
                });
            } else if (action === 'toggle-highlight') {
                existing.type = existing.type === 'highlight' ? 'bookmark' : 'highlight';
                saveExtensionSettings();
                renderBookmarkDecorations();
            }
        };
    });
}

function renderBookmarkDecorations() {
    const contentBox = document.getElementById('novel-reader-content');
    if (!contentBox || !state.activeBookId) return;

    const paragraphs = contentBox.querySelectorAll('.novel-p');
    const bookmarks = getBookBookmarks(state.activeBookId);
    const chapterBookmarks = bookmarks.filter(b => b.chapterIndex === state.activeChapterIndex);

    // 清理旧装饰
    paragraphs.forEach(p => {
        p.classList.remove('novel-bookmarked', 'novel-highlighted');
        const oldIcon = p.querySelector('.novel-bookmark-icon');
        if (oldIcon) oldIcon.remove();
        const oldNote = p.querySelector('.novel-bookmark-note');
        if (oldNote) oldNote.remove();
    });

    // 应用书签装饰
    chapterBookmarks.forEach(bm => {
        const p = paragraphs[bm.paragraphIndex];
        if (!p) return;

        if (bm.type === 'highlight') {
            p.classList.add('novel-highlighted');
        } else {
            p.classList.add('novel-bookmarked');
        }

        // 添加书签图标
        const icon = document.createElement('span');
        icon.className = 'novel-bookmark-icon';
        icon.textContent = bm.type === 'highlight' ? '🖍️' : '🔖';
        icon.title = '点击管理书签';
        icon.onclick = (e) => {
            e.stopPropagation();
            openBookmarkMenu(p, bm.paragraphIndex, e.clientX, e.clientY);
        };
        p.style.position = 'relative';
        p.appendChild(icon);

        // 显示笔记
        if (bm.note) {
            const noteEl = document.createElement('span');
            noteEl.className = 'novel-bookmark-note';
            noteEl.textContent = '📝 ' + bm.note;
            p.appendChild(noteEl);
        }
    });
}

function openBookmarkListDialog() {
    const oldDialog = document.querySelector('#novel-bookmark-list-dialog');
    if (oldDialog) oldDialog.remove();

    const bookId = state.activeBookId;
    const bookmarks = getBookBookmarks(bookId);

    const dialog = document.createElement('div');
    dialog.id = 'novel-bookmark-list-dialog';
    dialog.className = 'novel-dialog-mask';
    dialog.setAttribute('data-novel-theme', state.settings.theme);

    dialog.innerHTML = `
        <div class="novel-dialog-box" style="width: 340px; max-height:80vh;">
            <div class="novel-dialog-header">
                <span>🔖 书签列表 (${bookmarks.length})</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body" style="overflow-y:auto; max-height:60vh; padding:8px;">
                ${bookmarks.length === 0 ? '<div style="text-align:center;padding:30px;color:var(--kp-text-muted);font-size:12px;">还没有书签噢~<br>长按或右键段落可添加书签</div>' : ''}
                ${bookmarks.sort((a, b) => a.chapterIndex - b.chapterIndex || a.paragraphIndex - b.paragraphIndex).map(bm => `
                    <div class="novel-bookmark-list-item" data-timestamp="${bm.timestamp}">
                        <span class="novel-bm-chapter">${bm.type === 'highlight' ? '🖍️' : '🔖'} 第 ${bm.chapterIndex + 1} 章 · 第 ${bm.paragraphIndex + 1} 段</span>
                        <span class="novel-bm-text">${escapeHtml(bm.text || '')}</span>
                        ${bm.note ? '<span class="novel-bm-note">📝 ' + escapeHtml(bm.note) + '</span>' : ''}
                        <div class="novel-bm-actions">
                            <button data-action="goto" data-ts="${bm.timestamp}">跳转</button>
                            <button data-action="delete" data-ts="${bm.timestamp}">删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    applyTheme();

    dialog.querySelector('.novel-dialog-close').onclick = () => dialog.remove();

    // 事件委托
    dialog.querySelectorAll('.novel-bm-actions button').forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation();
            const ts = parseInt(btn.dataset.ts);
            const action = btn.dataset.action;

            if (action === 'goto') {
                const bm = bookmarks.find(b => b.timestamp === ts);
                if (bm) {
                    state.activeChapterIndex = bm.chapterIndex;
                    await renderActiveChapter();
                    // 滚动到对应段落
                    setTimeout(() => {
                        const contentBox = document.getElementById('novel-reader-content');
                        const targetP = contentBox?.querySelectorAll('.novel-p')[bm.paragraphIndex];
                        if (targetP) {
                            targetP.scrollIntoView({ block: 'center', behavior: 'smooth' });
                            targetP.style.outline = '2px solid var(--kp-primary)';
                            setTimeout(() => { targetP.style.outline = ''; }, 2000);
                        }
                    }, 100);
                    dialog.remove();
                }
            } else if (action === 'delete') {
                removeBookmark(bookId, ts);
                dialog.remove();
                openBookmarkListDialog(); // 刷新列表
            }
        };
    });
}


function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function quitReader() {
    document.getElementById('novel-reader-view').style.display = 'none';
    document.getElementById('novel-reader-menu-overlay').classList.remove('active');
    document.getElementById('novel-shelf-view').style.display = 'flex';
    state.activeBookId = null;
    renderShelf();
}

function renameBook(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;
    novelPrompt(`请输入《${book.title}》的新书名:`, book.title, '✏️').then(newName => {
        if (newName && newName.trim()) {
            book.title = newName.trim();
            saveExtensionSettings();
            renderShelf();
        }
    });
}

// ==================== 书籍封面编辑 ====================
function openCoverEditMenu(bookId, event) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;

    // 移除旧菜单
    const oldMenu = document.getElementById('novel-cover-edit-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'novel-cover-edit-menu';
    menu.className = 'novel-context-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        z-index: 200001;
        background: var(--kp-bg);
        border: 2px solid var(--kp-border);
        border-radius: 10px;
        box-shadow: var(--kp-shadow);
        padding: 8px;
        min-width: 160px;
    `;
    menu.setAttribute('data-novel-theme', state.settings.theme);

    menu.innerHTML = `
        <div class="novel-menu-item-ctx" data-action="gradient">🎨 使用默认渐变</div>
        <div class="novel-menu-item-ctx" data-action="text">✏️ 自定义文字</div>
        <div class="novel-menu-item-ctx" data-action="image">🖼️ 上传封面图片</div>
    `;

    document.body.appendChild(menu);
    applyTheme(); // 确保菜单使用当前主题

    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);

    // 菜单项事件
    menu.querySelectorAll('.novel-menu-item-ctx').forEach(item => {
        item.onclick = async () => {  // 🔧 改为 async
            const action = item.dataset.action;
            menu.remove();

            if (action === 'gradient') {
                // 🔧 删除封面（同时从 IndexedDB 和 settings 删除）
                try {
                    await deleteBookCoverFromDB(bookId);
                    // 兼容旧版：清理 settings 中的遗留数据
                    if (state.settings.bookCovers && state.settings.bookCovers[bookId]) {
                        delete state.settings.bookCovers[bookId];
                    }
                    saveExtensionSettings();
                    renderShelf();
                } catch (err) {
                    console.warn('[NovelReader] 删除封面失败:', err);
                    // 即使 IndexedDB 失败，也尝试清理 settings
                    if (state.settings.bookCovers && state.settings.bookCovers[bookId]) {
                        delete state.settings.bookCovers[bookId];
                        saveExtensionSettings();
                        renderShelf();
                    }
                }
            } else if (action === 'text') {
                const text = prompt('请输入封面文字或 Emoji（1-4个字符）:', '📚');
                if (text && text.trim()) {
                    // 🔧 保存到 IndexedDB
                    const coverData = { type: 'text', value: text.trim().substring(0, 4) };
                    try {
                        await saveBookCoverToDB(bookId, coverData);
                        saveExtensionSettings();
                        renderShelf();
                    } catch (err) {
                        handleError(err, '保存封面失败');
                    }
                }
            } else if (action === 'image') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // 🔧 检查文件类型
                    if (!file.type.startsWith('image/')) {
                        alert('请选择图片文件！');
                        return;
                    }
                    
                    // 🔧 检查文件大小（超过 5MB 拒绝）
                    if (file.size > 5 * 1024 * 1024) {
                        alert('图片过大（超过 5MB）！\n请使用更小的图片。');
                        return;
                    }
                    
                    // 🔧 使用压缩函数（最大 300×400，质量 0.8）
                    compressImage(file, 300, 400, 0.8, async (compressedDataUrl) => {
                        const coverData = { type: 'image', value: compressedDataUrl };
                        try {
                            // 🔧 保存到 IndexedDB
                            await saveBookCoverToDB(bookId, coverData);
                            saveExtensionSettings();
                            renderShelf();
                        } catch (err) {
                            handleError(err, '保存封面失败');
                        }
                    });
                };
                input.click();
            }
        };
    });
}




// ==================== 创建主面板 ====================
function createPanel() {
    if (document.getElementById('novel-player-extension-panel')) return;

    panelElement = document.createElement('div');
    panelElement.id = 'novel-player-extension-panel';
    panelElement.setAttribute('data-novel-theme', state.settings.theme);

    if (window.innerWidth <= 768) {
        const w = Math.min(window.innerWidth * 0.94, 500);
        const h = Math.min(window.innerHeight * 0.82, 700);
        panelElement.style.position = 'fixed';
        panelElement.style.width = w + 'px';
        panelElement.style.height = h + 'px';
        panelElement.style.left = (window.innerWidth - w) / 2 + 'px';
        panelElement.style.top = (window.innerHeight - h) / 2 + 'px';
        panelElement.classList.add('novel-mobile');
    } else {
        panelElement.style.position = 'fixed';
        panelElement.style.bottom = '80px';
        panelElement.style.right = '20px';
        panelElement.style.width = state.savedWidth;
        panelElement.style.height = state.savedHeight;
    }

    const themeEmoji = THEMES[state.settings.theme].emoji;

    panelElement.innerHTML = `
        <div class="novel-ext-header" id="novel-ext-header-drag">
            <span class="title">${themeEmoji} 萌猫小说阅读器 ${themeEmoji}</span>
            <div class="novel-ext-controls">
                <button id="novel-ext-help-btn" class="novel-ext-btn" title="说明" type="button">?</button>
                <button id="novel-ext-settings-btn" class="novel-ext-btn" title="设置" type="button">⚙</button>
                <button id="novel-ext-close-btn" class="novel-ext-btn" title="猫耳悬浮" type="button">×</button>
            </div>
        </div>

        <div id="novel-ext-lower-wrapper">
            <div id="novel-shelf-view" class="novel-view-active">
                <div class="novel-shelf-header">
                    <div class="novel-search-row">
                        <input type="text" id="novel-search-input" placeholder="输入书名搜索..." />
                        <select id="novel-sort-select" title="排序方式">
                            <option value="addedTime">按导入</option>
                            <option value="title">按名称</option>
                            <option value="lastRead">最近读</option>
                        </select>
                        <button id="novel-toggle-layout" class="novel-action-btn-flat" title="切换列表/网格排列" type="button">⚃</button>
                    </div>
                    <div class="novel-import-row">
                        <input type="file" id="novel-file-picker" accept=".txt,.epub" style="display:none;" />
                        <button id="novel-import-btn" class="novel-pink-action-btn" type="button">导入书籍</button>
                        <button id="novel-backup-btn" class="novel-mint-action-btn" type="button">备份</button>
                        <input type="file" id="novel-backup-picker" accept=".json" style="display:none;" />
                        <button id="novel-restore-btn" class="novel-mint-action-btn" type="button">还原</button>
                    </div>
                </div>
                <div class="novel-history-bar" id="novel-history-bar" style="display:none;"></div>
                <div class="novel-shelf-body" id="novel-shelf-container"></div>
            </div>

            <div id="novel-reader-view" style="display: none;">
                <div id="novel-reader-container">
                    <div id="novel-reader-chapter-title"></div>
                    <div id="novel-reader-content" style="font-size: ${state.settings.readerFontSize}px"></div>
                </div>

                <div id="novel-reader-progress-bar">
                    <div class="novel-progress-track">
                        <div class="novel-progress-fill" id="novel-progress-fill" style="width:0%"></div>
                    </div>
                    <span class="novel-progress-text" id="novel-progress-text">0% · 全书 0%</span>
                </div>

                <div id="novel-reader-menu-overlay">
                    <div class="novel-reader-header-menu">
                        <button id="novel-menu-back-btn" class="novel-menu-item">↩ 退出</button>
                        <div style="flex:1;"></div>
                        <button id="novel-menu-mode-toggle" class="novel-menu-item" style="font-size:11px;">📄 翻页</button>
                        <button id="novel-menu-font-dec" class="novel-menu-item" style="font-size:12px;">A-</button>
                        <button id="novel-menu-font-inc" class="novel-menu-item" style="font-size:14px;">A+</button>
                    </div>
                    <div style="flex:1; pointer-events: none;"></div>
                    <div class="novel-reader-footer-menu">
                        <button id="novel-menu-prev" class="novel-menu-item">◀ 上一章</button>
                        <button id="novel-menu-toc" class="novel-menu-item">📖 目录</button>
                        <button id="novel-menu-bookmarks" class="novel-menu-item">🔖 书签</button>
                        <button id="novel-menu-next" class="novel-menu-item">下一章 ▶</button>
                    </div>

                </div>
            </div>

        </div>
    `;

    document.body.appendChild(panelElement);
    setupPanelEventDelegation();
    applyTheme();

    if (state.savedPos && state.savedPos.left != null && state.savedPos.top != null) {
        panelElement.style.left = state.savedPos.left + 'px';
        panelElement.style.top = state.savedPos.top + 'px';
        panelElement.style.right = 'auto';
        panelElement.style.bottom = 'auto';
    }

    renderShelf();
}

function setupPanelEventDelegation() {
    document.getElementById('novel-ext-close-btn').onclick = enterFloatingState;
    document.getElementById('novel-ext-settings-btn').onclick = openSettingsDialog;
    document.getElementById('novel-ext-help-btn').onclick = openHelpDialog;

    const searchInput = document.getElementById('novel-search-input');
    searchInput.oninput = (e) => {
        state.searchQuery = e.target.value;
        renderShelf();
    };
    const sortSelect = document.getElementById('novel-sort-select');
    sortSelect.value = state.settings.shelfSortMode || 'addedTime';
    sortSelect.onchange = (e) => {
        state.settings.shelfSortMode = e.target.value;
        saveExtensionSettings();
        renderShelf();
    };

    document.getElementById('novel-toggle-layout').onclick = () => {
        state.settings.layoutMode = state.settings.layoutMode === 'list' ? 'grid' : 'list';
        saveExtensionSettings();
        renderShelf();
    };

    const filePicker = document.getElementById('novel-file-picker');
    document.getElementById('novel-import-btn').onclick = () => filePicker.click();
    filePicker.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.name.toLowerCase().endsWith('.epub')) {
                importEpubFile(file);
            } else {
                openImportConfigDialog(file);
            }
            // 🔧 修复：重置文件选择器，允许重复选择同一文件
            e.target.value = '';
        }
    };

    document.getElementById('novel-backup-btn').onclick = exportBackup;

    const backupPicker = document.getElementById('novel-backup-picker');
    document.getElementById('novel-restore-btn').onclick = () => backupPicker.click();
    backupPicker.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importBackup(file);
            // 🔧 修复：重置备份文件选择器
            e.target.value = '';
        }
    };

    const readerContainer = document.getElementById('novel-reader-container');
    readerContainer.onclick = (e) => {
        // 翻页模式下，左右区域由 tap 元素处理，这里只处理中间区域
        if (e.target.classList.contains('novel-page-tap-left') || e.target.classList.contains('novel-page-tap-right')) {
            return;
        }
        const rect = readerContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        if (x > w * 0.3 && x < w * 0.7 && y > h * 0.3 && y < h * 0.7) {
            document.getElementById('novel-reader-menu-overlay').classList.add('active');
        }
    };


    const menuOverlay = document.getElementById('novel-reader-menu-overlay');
    menuOverlay.onclick = (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    };

    document.getElementById('novel-menu-back-btn').onclick = quitReader;
    
    document.getElementById('novel-menu-prev').onclick = async () => {
        if (state.activeChapterIndex > 0) {
            state.activeChapterIndex--;
            await renderActiveChapter();
        } else {
            novelAlert('已经是第一章了噢！', '📖');
        }
    };

    document.getElementById('novel-menu-next').onclick = async () => {
        const book = state.books.find(b => b.id === state.activeBookId);
        if (book && state.activeChapterIndex < book.chaptersCount - 1) {
            state.activeChapterIndex++;
            await renderActiveChapter();
        } else {
            novelAlert('已经读到最后一章啦！', '📖');
        }
    };

    document.getElementById('novel-menu-toc').onclick = () => {
        menuOverlay.classList.remove('active');
        openTocDialog();
    };

    document.getElementById('novel-menu-bookmarks').onclick = () => {
        menuOverlay.classList.remove('active');
        openBookmarkListDialog();
    };

    document.getElementById('novel-menu-font-dec').onclick = () => {
        if (state.settings.readerFontSize > 12) {
            state.settings.readerFontSize -= 2;
            document.getElementById('novel-reader-content').style.fontSize = `${state.settings.readerFontSize}px`;
            saveExtensionSettings();
        }
    };
    document.getElementById('novel-menu-font-inc').onclick = () => {
        if (state.settings.readerFontSize < 36) {
            state.settings.readerFontSize += 2;
            document.getElementById('novel-reader-content').style.fontSize = `${state.settings.readerFontSize}px`;
            saveExtensionSettings();
        }
    };
    // 🆕 阅读进度条：监听滚动事件
    const readerContainerForProgress = document.getElementById('novel-reader-container');
    readerContainerForProgress.addEventListener('scroll', () => {
        updateReadingProgress();
    });
    // 🆕 阅读模式切换按钮（三态循环：滚动 → 推页 → 左右翻 → 滚动）
    document.getElementById('novel-menu-mode-toggle').onclick = () => {
        if (state.settings.readerMode === 'scroll') {
            state.settings.readerMode = 'paged';
        } else if (state.settings.readerMode === 'paged') {
            state.settings.readerMode = 'slide';
        } else {
            state.settings.readerMode = 'scroll';
        }
        saveExtensionSettings();
        applyReaderMode();
        document.getElementById('novel-reader-menu-overlay').classList.remove('active');
    };
    // 🆕 键盘快捷键
    document.addEventListener('keydown', handleReaderKeyboard);
    // 🆕 书签/标注：段落长按/右键交互
    setupBookmarkInteractions();
    // 🆕 渲染阅读历史栏
    renderReadingHistory();

    initDragSystem(panelElement, document.getElementById('novel-ext-header-drag'), false);
}

// ==================== EPUB 导入 ====================
async function importEpubFile(file) {
    // 动态加载 JSZip（如果尚未加载）
    if (!window.JSZip) {
        try {
            await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        } catch (err) {
            handleError(err, 'JSZip 加载失败，无法解析 EPUB');
            return;
        }
    }

    // 显示进度弹窗
    const progressDialog = document.createElement('div');
    progressDialog.className = 'novel-dialog-mask';
    progressDialog.setAttribute('data-novel-theme', state.settings.theme);
    progressDialog.innerHTML = `
        <div class="novel-dialog-box" style="width: 320px;">
            <div class="novel-dialog-header">
                <span>📥 正在导入 EPUB...</span>
            </div>
            <div class="novel-dialog-body" style="text-align:center; padding:24px;">
                <div style="font-size:14px; color:var(--kp-text); margin-bottom:12px;" id="novel-epub-status">正在解压文件...</div>
                <div style="width:100%; height:8px; background:var(--kp-primary-light); border-radius:10px; overflow:hidden;">
                    <div id="novel-epub-progress" style="width:0%; height:100%; background:var(--kp-primary); transition:width 0.3s ease;"></div>
                </div>
                <div style="font-size:11px; color:var(--kp-text-muted); margin-top:8px;" id="novel-epub-detail">请稍候...</div>
            </div>
        </div>
    `;
    document.body.appendChild(progressDialog);
    applyTheme();

    const updateProgress = (percent, status, detail) => {
        const bar = document.getElementById('novel-epub-progress');
        const statusEl = document.getElementById('novel-epub-status');
        const detailEl = document.getElementById('novel-epub-detail');
        if (bar) bar.style.width = percent + '%';
        if (statusEl) statusEl.textContent = status;
        if (detailEl) detailEl.textContent = detail;
    };

    try {
        updateProgress(10, '正在解压 EPUB...', `文件大小：${(file.size / 1024).toFixed(0)} KB`);

        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        updateProgress(25, '正在解析目录结构...', '读取 content.opf');

        // 找到 container.xml 以定位 OPF 文件
        const containerXml = await zip.file('META-INF/container.xml')?.async('text');
        let opfPath = '';
        if (containerXml) {
            const rootfileMatch = containerXml.match(/full-path="([^"]+)"/);
            if (rootfileMatch) opfPath = rootfileMatch[1];
        }
        if (!opfPath) {
            // 回退：尝试找任何 .opf 文件
            const opfFile = Object.keys(zip.files).find(f => f.endsWith('.opf'));
            if (opfFile) opfPath = opfFile;
        }
        if (!opfPath) throw new Error('无法找到 EPUB 的 content.opf 文件');

        const opfContent = await zip.file(opfPath)?.async('text');
        if (!opfContent) throw new Error('无法读取 content.opf');

        const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

        updateProgress(35, '正在解析章节列表...', '分析 spine 顺序');

        // 解析 OPF
        const parser = new DOMParser();
        const opfDoc = parser.parseFromString(opfContent, 'application/xml');

        // 获取书名
        const titleEl = opfDoc.querySelector('metadata title');
        const bookTitle = titleEl ? titleEl.textContent.trim() : file.name.replace(/\.[^/.]+$/, '');

        // 获取 manifest（id -> href 映射）
        const manifest = {};
        opfDoc.querySelectorAll('manifest item').forEach(item => {
            manifest[item.getAttribute('id')] = item.getAttribute('href');
        });

        // 获取 spine 顺序
        const spineItems = [];
        opfDoc.querySelectorAll('spine itemref').forEach(ref => {
            const idref = ref.getAttribute('idref');
            if (manifest[idref]) spineItems.push(manifest[idref]);
        });

        if (spineItems.length === 0) throw new Error('EPUB spine 为空，没有可读章节');

        updateProgress(45, '正在提取章节内容...', `共 ${spineItems.length} 个文件`);

        // 逐个提取章节内容
        const chapters = [];
        for (let i = 0; i < spineItems.length; i++) {
            const href = opfDir + spineItems[i];
            const htmlFile = zip.file(href);
            if (!htmlFile) continue;

            const htmlContent = await htmlFile.async('text');
            const { title, text } = extractTextFromHtml(htmlContent, i + 1);

            if (text.trim().length > 0) {
                chapters.push({ title, content: text });
            }

            if (i % 5 === 0) {
                const progress = 45 + Math.floor((i / spineItems.length) * 40);
                updateProgress(progress, '正在提取章节内容...', `${i + 1} / ${spineItems.length}`);
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        if (chapters.length === 0) throw new Error('EPUB 中未提取到有效文本内容');

        updateProgress(88, '正在保存到数据库...', `共 ${chapters.length} 章`);

        const bookId = 'book_' + Date.now();

        // 检查并清理同名旧书籍
        const existingBook = state.books.find(b => b.title === bookTitle);
        if (existingBook) {
            try {
                await deleteBookChaptersFromDB(existingBook.id);
                state.books = state.books.filter(b => b.id !== existingBook.id);
            } catch (err) { /* 静默 */ }
        }

        // 批量保存章节
        const batchSize = 50;
        for (let i = 0; i < chapters.length; i += batchSize) {
            const batch = chapters.slice(i, i + batchSize);
            await Promise.all(
                batch.map((ch, idx) => saveChapterToDB(bookId, i + idx, ch.title, ch.content))
            );
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        updateProgress(96, '正在完成...', '保存书籍信息');

        state.books.push({
            id: bookId,
            title: bookTitle,
            chaptersCount: chapters.length,
            currentChapter: 0,
            addedTime: Date.now()
        });

        saveExtensionSettings();
        updateProgress(100, '导入完成！', `《${bookTitle}》`);
        await new Promise(resolve => setTimeout(resolve, 600));

        progressDialog.remove();
        renderShelf();
        alert(`✅ EPUB 导入成功！\n\n书名：《${bookTitle}》\n章节：${chapters.length} 章`);
    } catch (err) {
        progressDialog.remove();
        handleError(err, 'EPUB 导入失败');
    }
}

function extractTextFromHtml(htmlString, fallbackIndex) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // 提取标题：优先 <title>，其次 <h1>-<h3>
    let title = '';
    const titleEl = doc.querySelector('title');
    if (titleEl && titleEl.textContent.trim()) {
        title = titleEl.textContent.trim();
    }
    if (!title) {
        const heading = doc.querySelector('h1, h2, h3');
        if (heading && heading.textContent.trim()) {
            title = heading.textContent.trim();
        }
    }
    if (!title) {
        title = `第 ${fallbackIndex} 章`;
    }

    // 提取正文：获取 body 内所有文本段落
    const body = doc.body;
    if (!body) return { title, text: '' };

    // 移除 script/style
    body.querySelectorAll('script, style').forEach(el => el.remove());

    // 提取段落文本
    const paragraphs = [];
    const blocks = body.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');
    if (blocks.length > 0) {
        blocks.forEach(block => {
            const t = block.textContent.trim();
            if (t) paragraphs.push(t);
        });
    } else {
        // 没有块级元素，直接取 body 文本
        const bodyText = body.textContent.trim();
        if (bodyText) paragraphs.push(bodyText);
    }

    return { title, text: paragraphs.join('\n') };
}

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) { resolve(); return; }
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load: ${url}`));
        document.head.appendChild(script);
    });
}

// ==================== 导入配置对话框 ====================
function openImportConfigDialog(file) {
    if (importConfigDialogElement) importConfigDialogElement.remove();

    importConfigDialogElement = document.createElement('div');
    importConfigDialogElement.className = 'novel-dialog-mask';
    importConfigDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    const defaultRegex = '第[一二三四五六七八九十百千万零0-9a-zA-Z\\s]+[章节卷回集折篇幕]';

    importConfigDialogElement.innerHTML = `
        <div class="novel-dialog-box" style="width: 340px;">
            <div class="novel-dialog-header">
                <span>📂 导入设置：${escapeHtml(file.name)}</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body">
                <div class="novel-section">
                    <label class="novel-label">切章方式：</label>
                    <select id="novel-split-method" class="novel-settings-select">
                        <option value="regex" selected>正则表达式切章 (一般常用)</option>
                        <option value="wordCount">按固定字数切章</option>
                        <option value="newlines">按空行与标题智能切</option>
                        <option value="none">不切章 (单章整本)</option>
                    </select>
                </div>

                <div id="novel-regex-opts" class="novel-section">
                    <label class="novel-label">正则表达式配对：</label>
                    <input type="text" id="novel-split-regex" class="novel-avatar-input" value="${defaultRegex}" />
                    <p class="novel-tip-text">提示：大部分国内小说推荐使用默认规则。高级匹配支持自定义正则。</p>
                </div>

                <div id="novel-wordcount-opts" class="novel-section" style="display:none;">
                    <label class="novel-label">单章限制字数：</label>
                    <input type="number" id="novel-split-words" class="novel-avatar-input" value="5000" />
                </div>

                <div class="novel-settings-actions" style="margin-top:20px;">
                    <button id="novel-import-confirm" type="button" class="novel-action-btn-sm novel-action-btn-primary">开始导入并解析</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(importConfigDialogElement);
    applyTheme();

    const selectMethod = document.getElementById('novel-split-method');
    const regexOpts = document.getElementById('novel-regex-opts');
    const wordcountOpts = document.getElementById('novel-wordcount-opts');

    selectMethod.onchange = () => {
        regexOpts.style.display = selectMethod.value === 'regex' ? 'block' : 'none';
        wordcountOpts.style.display = selectMethod.value === 'wordCount' ? 'block' : 'none';
    };

    importConfigDialogElement.querySelector('.novel-dialog-close').onclick = () => importConfigDialogElement.remove();

    document.getElementById('novel-import-confirm').onclick = async () => {
        const method = selectMethod.value;
        const regexPattern = document.getElementById('novel-split-regex').value;
        const wordCount = document.getElementById('novel-split-words').value;

        importConfigDialogElement.remove();

        // 显示进度提示弹窗
        const progressDialog = document.createElement('div');
        progressDialog.className = 'novel-dialog-mask';
        progressDialog.setAttribute('data-novel-theme', state.settings.theme);
        progressDialog.innerHTML = `
            <div class="novel-dialog-box" style="width: 320px;">
                <div class="novel-dialog-header">
                    <span>📥 正在导入...</span>
                </div>
                <div class="novel-dialog-body" style="text-align:center; padding:24px;">
                    <div style="font-size:14px; color:var(--kp-text); margin-bottom:12px;" id="novel-import-status">正在读取文件...</div>
                    <div style="width:100%; height:8px; background:var(--kp-primary-light); border-radius:10px; overflow:hidden;">
                        <div id="novel-import-progress" style="width:0%; height:100%; background:var(--kp-primary); transition:width 0.3s ease;"></div>
                    </div>
                    <div style="font-size:11px; color:var(--kp-text-muted); margin-top:8px;" id="novel-import-detail">请稍候...</div>
                </div>
            </div>
        `;
        document.body.appendChild(progressDialog);
        applyTheme();

        const updateProgress = (percent, status, detail) => {
            const bar = document.getElementById('novel-import-progress');
            const statusEl = document.getElementById('novel-import-status');
            const detailEl = document.getElementById('novel-import-detail');
            if (bar) bar.style.width = percent + '%';
            if (statusEl) statusEl.textContent = status;
            if (detailEl) detailEl.textContent = detail;
        };

        try {
            updateProgress(10, '正在读取文件...', `文件大小：${(file.size / 1024).toFixed(0)} KB`);

            // 🔧 调用统一的智能编码检测函数，避免重复逻辑
            const rawText = await detectEncodingAndRead(file, (progress) => {
                // progress 范围 0~1，映射到进度条 10%~35%
                const percent = 10 + Math.floor(progress * 25);
                updateProgress(percent, '正在解析编码...', '智能识别文件编码中');
            });

            updateProgress(35, '正在分析章节...', '解析章节结构中');
            await new Promise(resolve => setTimeout(resolve, 50));

            const chapters = executeSplit(rawText, { method, regexPattern, wordCount });

            if (chapters.length === 0) {
                throw new Error('未产生可读文本，请检查文件内容或切章规则');
            }

            updateProgress(45, '正在准备导入...', `共解析出 ${chapters.length} 个章节`);
            await new Promise(resolve => setTimeout(resolve, 50));

            const bookId = 'book_' + Date.now();
            const bookTitle = file.name.replace(/\.[^/.]+$/, "");

            // 检查并清理同名旧书籍
            const existingBook = state.books.find(b => b.title === bookTitle);
            if (existingBook) {
                updateProgress(48, '清理旧数据...', '删除同名书籍的旧章节');
                try {
                    await deleteBookChaptersFromDB(existingBook.id);
                    state.books = state.books.filter(b => b.id !== existingBook.id);
                } catch (err) {
                    console.warn('清理旧书籍数据失败:', err);
                }
                await new Promise(resolve => setTimeout(resolve, 30));
            }

            // 分批导入章节，每批 50 个避免阻塞主线程
            const batchSize = 50;
            for (let i = 0; i < chapters.length; i += batchSize) {
                const batch = chapters.slice(i, i + batchSize);
                await Promise.all(
                    batch.map((ch, idx) => saveChapterToDB(bookId, i + idx, ch.title, ch.content))
                );
                const progress = 50 + Math.floor((Math.min(i + batchSize, chapters.length) / chapters.length) * 45);
                updateProgress(progress, '正在保存章节...', `${Math.min(i + batchSize, chapters.length)} / ${chapters.length}`);
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            updateProgress(96, '正在完成...', '保存书籍信息');
            state.books.push({
                id: bookId,
                title: bookTitle,
                chaptersCount: chapters.length,
                currentChapter: 0,
                addedTime: Date.now()
            });

            saveExtensionSettings();
            updateProgress(100, '导入完成！', `《${bookTitle}》`);
            await new Promise(resolve => setTimeout(resolve, 600));

            progressDialog.remove();
            renderShelf();
            alert(`✅ 导入成功！\n\n书名：《${bookTitle}》\n章节：${chapters.length} 章`);
        } catch (err) {
            progressDialog.remove();
            handleError(err, '导入失败');
        }

        // 重置文件选择器，允许重复选择同一文件
        const filePicker = document.getElementById('novel-file-picker');
        if (filePicker) filePicker.value = '';
    };
}



// ==================== 目录对话框（优化版） ====================
async function openTocDialog() {
    if (tocDialogElement) tocDialogElement.remove();

    const book = state.books.find(b => b.id === state.activeBookId);
    if (!book) return;

    tocDialogElement = document.createElement('div');
    tocDialogElement.className = 'novel-dialog-mask';
    tocDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    tocDialogElement.innerHTML = `
        <div class="novel-dialog-box" style="width: 320px; max-height:80vh;">
            <div class="novel-dialog-header">
                <span>📖 章节目录 (${book.chaptersCount})</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body" id="novel-toc-list-box" style="overflow-y:auto; flex:1; max-height: 60vh;">
                <div style="text-align:center; padding:20px; color:var(--kp-text-muted);">加载中...</div>
            </div>
        </div>
    `;

    document.body.appendChild(tocDialogElement);
    applyTheme();
    
    tocDialogElement.querySelector('.novel-dialog-close').onclick = () => tocDialogElement.remove();

    const tocContainer = document.getElementById('novel-toc-list-box');
    
    // 分批渲染，避免大量章节时卡顿
    const batchSize = 50;
    
    for (let i = 0; i < book.chaptersCount; i += batchSize) {
        const fragment = document.createDocumentFragment();
        const end = Math.min(i + batchSize, book.chaptersCount);
        const batchItems = [];
        
        for (let j = i; j < end; j++) {
            const item = document.createElement('div');
            item.className = `novel-toc-item ${j === state.activeChapterIndex ? 'active' : ''}`;
            item.setAttribute('data-idx', j);
            item.textContent = `第 ${j + 1} 章 · 加载中...`;
            fragment.appendChild(item);
            batchItems.push({ element: item, index: j });
        }
        
        if (i === 0) {
            tocContainer.innerHTML = '';
        }
        tocContainer.appendChild(fragment);
        
        // 异步加载标题
        Promise.all(
            batchItems.map(async ({ element, index }) => {
                try {
                    const chData = await getChapterFromDB(state.activeBookId, index);
                    const domItem = tocContainer.querySelector(`[data-idx="${index}"]`);
                    if (domItem && chData) {
                        domItem.textContent = chData.title;
                        domItem.onclick = async () => {
                            state.activeChapterIndex = index;
                            await renderActiveChapter();
                            tocDialogElement.remove();
                        };
                    }
                } catch (err) {
                    console.warn(`加载章节 ${index} 标题失败:`, err);
                }
            })
        );
        
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    const activeItem = tocContainer.querySelector('.novel-toc-item.active');
    if (activeItem) {
        setTimeout(() => activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' }), 100);
    }
}

// ==================== 设置弹窗 ====================
function openSettingsDialog() {
    if (document.getElementById('novel-ext-settings-dialog')) {
        closeSettingsDialog();
        return;
    }

    settingsDialogElement = document.createElement('div');
    settingsDialogElement.id = 'novel-ext-settings-dialog';
    settingsDialogElement.className = 'novel-dialog-mask';
    settingsDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    settingsDialogElement.innerHTML = `
        <div class="novel-settings-box" data-novel-theme="${state.settings.theme}">
            <div class="novel-settings-header">
                <span>⚙ 主题与外观设置</span>
                <button class="novel-settings-close" type="button">×</button>
            </div>
            <div class="novel-settings-body">
                <div class="novel-settings-section">
                    <div class="novel-settings-label">🎨 主题配色</div>
                    <div class="novel-theme-grid">
                        ${Object.entries(THEMES).map(([key, info]) => `
                            <label class="novel-theme-option" data-theme-key="${key}">
                                <input type="radio" name="novel-theme" value="${key}" ${state.settings.theme === key ? 'checked' : ''}>
                                <div class="novel-theme-preview novel-theme-preview-${key}"></div>
                                <span>${info.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🖼️ 主页面背景图片</div>
                    <div class="novel-main-bg-controls">
                        <input type="file" id="novel-main-bg-upload" accept="image/*" style="display:none;">
                        <button id="novel-main-bg-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-primary" style="width:100%;margin-bottom:8px;">
                            ${state.settings.mainBgImage ? '✓ 已设置背景' : '📁 上传主页面背景'}
                        </button>
                        ${state.settings.mainBgImage ? '<button id="novel-main-bg-clear-btn" type="button" class="novel-action-btn-sm" style="width:100%;font-size:10px;margin-bottom:8px;">✕ 移除背景</button>' : ''}
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">背景透明度：<span id="novel-main-opacity-value">${Math.round((state.settings.mainBgOpacity || 0.3) * 100)}%</span></label>
                        <input type="range" id="novel-main-opacity-slider" min="0" max="100" value="${(state.settings.mainBgOpacity || 0.3) * 100}" style="width:100%;">
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🔘 悬浮球尺寸</div>
                    <div class="novel-size-options">
                        <label class="novel-size-option">
                            <input type="radio" name="novel-badge-size" value="large" ${state.settings.badgeSize === 'large' ? 'checked' : ''}>
                            <span>大（72px）</span>
                        </label>
                        <label class="novel-size-option">
                            <input type="radio" name="novel-badge-size" value="medium" ${state.settings.badgeSize === 'medium' ? 'checked' : ''}>
                            <span>中（58px）</span>
                        </label>
                        <label class="novel-size-option">
                            <input type="radio" name="novel-badge-size" value="small" ${state.settings.badgeSize === 'small' ? 'checked' : ''}>
                            <span>小（44px）</span>
                        </label>
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🐱 悬浮球猫咪头像</div>
                    <div class="novel-avatar-type">
                        <label><input type="radio" name="novel-avatar-type" value="emoji" ${state.settings.avatarType === 'emoji' ? 'checked' : ''}> <span>Emoji/颜文字</span></label>
                        <label><input type="radio" name="novel-avatar-type" value="url" ${state.settings.avatarType === 'url' ? 'checked' : ''}> <span>网络图片</span></label>
                        <label><input type="radio" name="novel-avatar-type" value="upload" ${state.settings.avatarType === 'upload' ? 'checked' : ''}> <span>本地上传</span></label>
                    </div>
                    <div class="novel-avatar-input-wrap">
                        <input type="text" id="novel-avatar-emoji" class="novel-avatar-input" placeholder="输入一两个字符，如 🐾 或 🐱" value="${state.settings.avatarType === 'emoji' ? state.settings.avatarValue : ''}" style="display:${state.settings.avatarType === 'emoji' ? 'block' : 'none'}">
                        <input type="text" id="novel-avatar-url" class="novel-avatar-input" placeholder="http://..." value="${state.settings.avatarType === 'url' ? state.settings.avatarValue : ''}" style="display:${state.settings.avatarType === 'url' ? 'block' : 'none'}">
                        <div id="novel-avatar-upload-area" style="display:${state.settings.avatarType === 'upload' ? 'block' : 'none'}">
                            <input type="file" id="novel-avatar-upload-input" accept="image/*" style="display:none;">
                            <button id="novel-avatar-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-primary">
                                ${state.settings.avatarType === 'upload' && state.settings.avatarValue ? '✓ 已上传头像' : '📁 上传头像图片'}
                            </button>
                            ${state.settings.avatarType === 'upload' && state.settings.avatarValue ? '<div class="novel-avatar-preview"><img src="' + resolveAsset(state.settings.avatarValue) + '" alt="预览" style="width:48px;height:48px;border-radius:50%;margin-top:8px;object-fit:cover;border:2px solid var(--kp-primary);"></div>' : ''}
                        </div>
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🖼️ 悬浮球头像框</div>
                    
                    <label style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:10px;">
                        <input type="checkbox" id="novel-badge-ears-visible" ${state.settings.badgeEarsVisible !== false ? 'checked' : ''}>
                        <span>显示猫耳外框（耳朵+圆形边框）</span>
                    </label>
                    
                    <div class="novel-avatar-frame-type" style="display:flex;gap:12px;margin-bottom:8px;">
                        <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;"><input type="radio" name="novel-frame-type" value="none" ${!state.settings.avatarFrameType || state.settings.avatarFrameType === 'none' ? 'checked' : ''}> <span>不使用</span></label>
                        <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;"><input type="radio" name="novel-frame-type" value="url" ${state.settings.avatarFrameType === 'url' ? 'checked' : ''}> <span>网络图片</span></label>
                        <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;"><input type="radio" name="novel-frame-type" value="upload" ${state.settings.avatarFrameType === 'upload' ? 'checked' : ''}> <span>本地上传</span></label>
                    </div>
                    <div class="novel-avatar-frame-input-wrap">
                        <input type="text" id="novel-frame-url" class="novel-avatar-input" placeholder="http://头像框图片链接..." value="${state.settings.avatarFrameType === 'url' ? (state.settings.avatarFrame || '') : ''}" style="display:${state.settings.avatarFrameType === 'url' ? 'block' : 'none'};margin-bottom:8px;">
                        <div id="novel-frame-upload-area" style="display:${state.settings.avatarFrameType === 'upload' ? 'block' : 'none'};margin-bottom:8px;">
                            <input type="file" id="novel-frame-upload-input" accept="image/*" style="display:none;">
                            <button id="novel-frame-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-primary" style="width:100%;">
                                ${state.settings.avatarFrameType === 'upload' && state.settings.avatarFrame ? '✓ 已上传头像框' : '📁 上传头像框图片'}
                            </button>
                        </div>
                        
                        <div class="novel-frame-controls" style="display:${state.settings.avatarFrameType && state.settings.avatarFrameType !== 'none' ? 'block' : 'none'};margin-top:12px;">
                            <label style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:8px;">
                                <input type="checkbox" id="novel-frame-visible" ${state.settings.avatarFrameVisible !== false ? 'checked' : ''}>
                                <span>显示头像框</span>
                            </label>
                            
                            <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">头像框位置：</label>
                            <select id="novel-frame-position" class="novel-settings-select" style="margin-bottom:8px;">
                                <option value="back" ${state.settings.avatarFramePosition === 'back' || !state.settings.avatarFramePosition ? 'selected' : ''}>在头像后面</option>
                                <option value="front" ${state.settings.avatarFramePosition === 'front' ? 'selected' : ''}>在头像前面</option>
                            </select>
                            
                            <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">头像框大小：<span id="novel-frame-size-value">${state.settings.avatarFrameSize || 100}%</span></label>
                            <input type="range" id="novel-frame-size-slider" min="50" max="200" value="${state.settings.avatarFrameSize || 100}" style="width:100%;margin-bottom:8px;">
                            
                            <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">水平偏移：<span id="novel-frame-x-value">${state.settings.avatarFrameOffsetX || 0}px</span></label>
                            <input type="range" id="novel-frame-x-slider" min="-20" max="20" value="${state.settings.avatarFrameOffsetX || 0}" style="width:100%;margin-bottom:8px;">
                            
                            <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">垂直偏移：<span id="novel-frame-y-value">${state.settings.avatarFrameOffsetY || 0}px</span></label>
                            <input type="range" id="novel-frame-y-slider" min="-20" max="20" value="${state.settings.avatarFrameOffsetY || 0}" style="width:100%;margin-bottom:8px;">
                        </div>
                    </div>
                    
                    <div class="novel-frame-preview" style="margin-top:12px;padding:12px;background:var(--kp-bg-soft);border-radius:10px;text-align:center;">
                        <div style="font-size:10px;color:var(--kp-text-muted);margin-bottom:8px;">🔍 悬浮球实时预览</div>
                        <div id="novel-frame-preview-wrapper" style="position:relative;width:72px;height:76px;margin:0 auto;">
                            <div id="novel-frame-preview-ear-left" style="position:absolute;width:18px;height:16px;background:var(--kp-primary-deep);border:3px solid var(--kp-bg);border-radius:10px 10px 0 0;top:3px;left:5px;transform:rotate(-30deg);transform-origin:bottom center;${state.settings.badgeEarsVisible !== false ? '' : 'display:none;'}"></div>
                            <div id="novel-frame-preview-ear-right" style="position:absolute;width:18px;height:16px;background:var(--kp-primary-deep);border:3px solid var(--kp-bg);border-radius:10px 10px 0 0;top:3px;right:5px;transform:rotate(30deg);transform-origin:bottom center;${state.settings.badgeEarsVisible !== false ? '' : 'display:none;'}"></div>
                            <div id="novel-frame-preview-box" style="position:absolute;bottom:0;left:3px;width:52px;height:52px;border:${state.settings.badgeEarsVisible !== false ? '4px' : '0px'} solid var(--kp-primary-deep);border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:visible;background:var(--kp-bg);">
                                <span id="novel-frame-preview-avatar" style="font-size:24px;z-index:1;">${state.settings.avatarType === 'emoji' || !state.settings.avatarValue ? (state.settings.avatarValue || THEMES[state.settings.theme].emoji) : ''}</span>
                                ${(state.settings.avatarType === 'url' || state.settings.avatarType === 'upload') && state.settings.avatarValue ? '<img src="' + resolveAsset(state.settings.avatarValue) + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0;z-index:1;">' : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">📖 阅读器自定义</div>
                    
                    <div class="novel-reader-bg-controls" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">阅读背景图片</label>
                        <input type="file" id="novel-reader-bg-upload" accept="image/*" style="display:none;">
                        <button id="novel-reader-bg-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-secondary" style="width:100%;margin-bottom:8px;">
                            ${state.settings.readerBgImage ? '✓ 已设置背景' : '📁 上传阅读背景'}
                        </button>
                        ${state.settings.readerBgImage ? '<button id="novel-reader-bg-clear-btn" type="button" class="novel-action-btn-sm" style="width:100%;font-size:10px;">✕ 清除背景</button>' : ''}
                    </div>

                    <div class="novel-reader-opacity-control" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">背景透明度：<span id="novel-opacity-value">${Math.round(state.settings.readerBgOpacity * 100)}%</span></label>
                        <input type="range" id="novel-reader-opacity-slider" min="0" max="100" value="${state.settings.readerBgOpacity * 100}" style="width:100%;">
                    </div>

                    <div class="novel-reader-brightness-control" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">背景明暗度：<span id="novel-brightness-value">${Math.round((state.settings.readerBgBrightness || 1) * 100)}%</span></label>
                        <input type="range" id="novel-reader-brightness-slider" min="50" max="150" value="${(state.settings.readerBgBrightness || 1) * 100}" style="width:100%;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">行间距：<span id="novel-line-height-value">${state.settings.readerLineHeight || 1.8}</span></label>
                        <input type="range" id="novel-line-height-slider" min="12" max="30" value="${Math.round((state.settings.readerLineHeight || 1.8) * 10)}" style="width:100%;">
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">段间距：<span id="novel-para-spacing-value">${state.settings.readerParagraphSpacing !== undefined ? state.settings.readerParagraphSpacing : 14}px</span></label>
                        <input type="range" id="novel-para-spacing-slider" min="0" max="40" value="${state.settings.readerParagraphSpacing !== undefined ? state.settings.readerParagraphSpacing : 14}" style="width:100%;">
                    </div>
                    <div class="novel-reader-font-controls">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">
                            阅读字体
                            <a href="https://fonts.zeoseven.com/" target="_blank" style="margin-left:8px;color:var(--kp-primary-deep);text-decoration:none;font-weight:bold;">🔗 字体挑选网站</a>
                        </label>
                        <select id="novel-reader-font-family" class="novel-settings-select" style="margin-bottom:8px;">
                            <option value="system" ${state.settings.readerFontFamily === 'system' ? 'selected' : ''}>系统默认</option>
                            <option value="serif" ${state.settings.readerFontFamily === 'serif' ? 'selected' : ''}>宋体衬线</option>
                            <option value="sans" ${state.settings.readerFontFamily === 'sans' ? 'selected' : ''}>黑体无衬线</option>
                            <option value="kai" ${state.settings.readerFontFamily === 'kai' ? 'selected' : ''}>楷体</option>
                            <option value="fang" ${state.settings.readerFontFamily === 'fang' ? 'selected' : ''}>仿宋</option>
                            <option value="customName" ${state.settings.readerFontFamily === 'customName' ? 'selected' : ''}>系统字体名称</option>
                            <option value="customUrl" ${state.settings.readerFontFamily === 'customUrl' ? 'selected' : ''}>网络字体链接</option>
                            <option value="customUpload" ${state.settings.readerFontFamily === 'customUpload' ? 'selected' : ''}>上传字体文件</option>
                            <option value="cssImport" ${state.settings.readerFontFamily === 'cssImport' ? 'selected' : ''}>@import CSS 字体</option>
                        </select>
                        
                        <input type="text" id="novel-reader-custom-font-name" class="novel-avatar-input" placeholder="输入字体名称，如：霞鹜文楷" value="${state.settings.readerFontFamily === 'customName' ? state.settings.readerCustomFont : ''}" style="display:${state.settings.readerFontFamily === 'customName' ? 'block' : 'none'};margin-bottom:8px;">
                        
                        <input type="text" id="novel-reader-custom-font-url" class="novel-avatar-input" placeholder="输入 .woff2/.ttf 字体链接" value="${state.settings.readerCustomFontUrl || ''}" style="display:${state.settings.readerFontFamily === 'customUrl' ? 'block' : 'none'};margin-bottom:8px;">
                        
                        <div id="novel-reader-font-upload-area" style="display:${state.settings.readerFontFamily === 'customUpload' ? 'block' : 'none'}">
                            <input type="file" id="novel-reader-font-upload-input" accept=".ttf,.otf,.woff,.woff2" style="display:none;">
                            <button id="novel-reader-font-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-secondary" style="width:100%;">
                                ${state.settings.readerFontFamily === 'customUpload' && state.settings.readerCustomFontUrl ? '✓ 已上传字体' : '📁 上传字体文件'}
                            </button>
                        </div>
                        <div id="novel-reader-font-css-area" style="display:${state.settings.readerFontFamily === 'cssImport' ? 'block' : 'none'}">
                            <textarea id="novel-reader-font-css-input" class="novel-avatar-input" placeholder="粘贴完整的 @import CSS 代码，例如：\n@import url(&quot;https://...&quot;);\n\nbody {\n    font-family: &quot;字体名称&quot;;\n}" style="width:100%;min-height:100px;resize:vertical;font-size:11px;font-family:monospace;margin-bottom:8px;">${state.settings.readerFontImportCSS || ''}</textarea>
                            <p class="novel-tip-text">粘贴包含 @import 和 font-family 的完整 CSS 代码，插件会自动提取字体名称和导入链接。</p>
                        </div>
                    </div>
                </div>

                <div class="novel-settings-actions">
                    <button id="novel-settings-save" type="button" class="novel-action-btn-sm novel-action-btn-primary">保存设置</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(settingsDialogElement);
    applyTheme();
    setupSettingsEvents();
}


function setupSettingsEvents() {
    const dialog = settingsDialogElement;
    dialog.querySelector('.novel-settings-close').onclick = closeSettingsDialog;

    // 🔧 修复：主题切换时实时预览颜色
    dialog.querySelectorAll('input[name="novel-theme"]').forEach(radio => {
        radio.onchange = (e) => {
            const selectedTheme = e.target.value;
            const colors = THEME_COLORS[selectedTheme] || THEME_COLORS.pink;

            state.settings.theme = selectedTheme;
    
            // 🔧 修复：同时更新 mask 层和内部 settings-box 的 data-novel-theme
            dialog.setAttribute('data-novel-theme', selectedTheme);
            const settingsBox = dialog.querySelector('.novel-settings-box');
            if (settingsBox) {
                settingsBox.setAttribute('data-novel-theme', selectedTheme);
                // 同步设置 CSS 变量到 settings-box（因为它有独立的默认变量声明）
                settingsBox.style.setProperty('--kp-primary', colors.primary);
                settingsBox.style.setProperty('--kp-primary-light', colors.primaryLight);
                settingsBox.style.setProperty('--kp-primary-deep', colors.primaryDeep);
                settingsBox.style.setProperty('--kp-secondary', colors.secondary);
                settingsBox.style.setProperty('--kp-bg', colors.bg);
                settingsBox.style.setProperty('--kp-bg-soft', colors.bgSoft);
                settingsBox.style.setProperty('--kp-text', colors.text);
                settingsBox.style.setProperty('--kp-text-muted', colors.textMuted);
                settingsBox.style.setProperty('--kp-border', colors.border);
                settingsBox.style.setProperty('--kp-action-primary', colors.actionPrimary);
                settingsBox.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
                settingsBox.style.setProperty('--kp-action-secondary', colors.actionSecondary);
                settingsBox.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
                settingsBox.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
        
                // 暗色主题背景色直接设置
                const bgMap = {
                    'glass-light': 'rgba(255, 255, 255, 0.75)',
                    'glass-dark': 'rgba(30, 25, 45, 0.78)',
                    'sakura': 'rgba(40, 30, 45, 0.82)',
                    'mocha': 'rgba(45, 35, 28, 0.84)'
                };
                settingsBox.style.backgroundColor = bgMap[selectedTheme] || '';
            }
            applyTheme();

            const bgMap = {
                'glass-light': 'rgba(255, 255, 255, 0.75)',
                'glass-dark': 'rgba(30, 25, 45, 0.78)',
                'sakura': 'rgba(40, 30, 45, 0.82)',
                'mocha': 'rgba(45, 35, 28, 0.84)'
            };
        };
    });

    // 🔧 头像类型切换 + 预览联动
    dialog.querySelectorAll('input[name="novel-avatar-type"]').forEach(radio => {
        radio.onchange = (e) => {
            const val = e.target.value;
            document.getElementById('novel-avatar-emoji').style.display = val === 'emoji' ? 'block' : 'none';
            document.getElementById('novel-avatar-url').style.display = val === 'url' ? 'block' : 'none';
            document.getElementById('novel-avatar-upload-area').style.display = val === 'upload' ? 'block' : 'none';
            
            // 🆕 更新预览区域的头像显示
            const previewAvatar = document.getElementById('novel-frame-preview-avatar');
            const previewBox = document.getElementById('novel-frame-preview-box');
            if (previewBox) {
                const oldPreviewImg = previewBox.querySelector('img:not(.novel-preview-frame-img)');
                if (oldPreviewImg) oldPreviewImg.remove();
                
                if (val === 'emoji') {
                    if (previewAvatar) {
                        previewAvatar.style.display = '';
                        previewAvatar.textContent = document.getElementById('novel-avatar-emoji').value || THEMES[state.settings.theme].emoji;
                    }
                } else if (val === 'url') {
                    const url = document.getElementById('novel-avatar-url').value.trim();
                    if (url) {
                        if (previewAvatar) previewAvatar.style.display = 'none';
                        const img = document.createElement('img');
                        img.src = url;
                        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0;z-index:1;';
                        img.onerror = () => {
                            img.remove();
                            if (previewAvatar) { previewAvatar.style.display = ''; previewAvatar.textContent = '❌'; }
                        };
                        previewBox.appendChild(img);
                    } else {
                        if (previewAvatar) { previewAvatar.style.display = ''; previewAvatar.textContent = THEMES[state.settings.theme].emoji; }
                    }
                } else if (val === 'upload') {
                    if (state.settings.avatarValue && state.settings.avatarType === 'upload') {
                        if (previewAvatar) previewAvatar.style.display = 'none';
                        const img = document.createElement('img');
                        img.src = resolveAsset(state.settings.avatarValue);
                        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0;z-index:1;';
                        previewBox.appendChild(img);
                    } else {
                        if (previewAvatar) { previewAvatar.style.display = ''; previewAvatar.textContent = THEMES[state.settings.theme].emoji; }
                    }
                }

            }
        };
    });

    // 🔧 本地头像上传事件
    const avatarUploadInput = document.getElementById('novel-avatar-upload-input');
    const avatarUploadBtn = document.getElementById('novel-avatar-upload-btn');
    if (avatarUploadBtn && avatarUploadInput) {
        avatarUploadBtn.onclick = () => avatarUploadInput.click();
        avatarUploadInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target.result;
                try {
                    // 🆕 存到 IndexedDB
                    await saveAssetToDB('avatar_img', dataUrl);
                    state.settings.avatarType = 'upload';
                    state.settings.avatarValue = 'idb:avatar_img';
                    saveExtensionSettings();
                    avatarUploadBtn.textContent = '✓ 上传成功！';
                } catch (err) {
                    // IndexedDB 失败时回退到直接存储（兼容）
                    state.settings.avatarType = 'upload';
                    state.settings.avatarValue = dataUrl;
                    saveExtensionSettings();
                    avatarUploadBtn.textContent = '✓ 上传成功！';
                }
                
                // 预览区域（用原始 dataUrl 显示，因为这时候缓存里已经有了）
                const previewArea = document.querySelector('.novel-avatar-preview');
                if (previewArea) previewArea.remove();
                const preview = document.createElement('div');
                preview.className = 'novel-avatar-preview';
                preview.innerHTML = '<img src="' + dataUrl + '" alt="预览" style="width:48px;height:48px;border-radius:50%;margin-top:8px;object-fit:cover;border:2px solid var(--kp-primary);">';
                document.getElementById('novel-avatar-upload-area').appendChild(preview);
                
                // 同步更新悬浮球预览
                const previewBox = document.getElementById('novel-frame-preview-box');
                const previewAvatar = document.getElementById('novel-frame-preview-avatar');
                if (previewBox) {
                    const oldImg = previewBox.querySelector('img:not(.novel-preview-frame-img)');
                    if (oldImg) oldImg.remove();
                    if (previewAvatar) previewAvatar.style.display = 'none';
                    const img = document.createElement('img');
                    img.src = dataUrl;
                    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0;z-index:1;';
                    previewBox.appendChild(img);
                }
                
                // 🔧 立即刷新悬浮球头像
                updateBadgeAvatar();
            };
            reader.readAsDataURL(file);
        };

    }

    // 🆕 Emoji 输入框实时更新预览
    const emojiInput = document.getElementById('novel-avatar-emoji');
    if (emojiInput) {
        emojiInput.oninput = (e) => {
            const previewAvatar = document.getElementById('novel-frame-preview-avatar');
            if (previewAvatar) {
                previewAvatar.textContent = e.target.value || THEMES[state.settings.theme].emoji;
            }
        };
    }

    // 🆕 头像 URL 输入框实时更新预览
    const avatarUrlInput = document.getElementById('novel-avatar-url');
    if (avatarUrlInput) {
        avatarUrlInput.oninput = (e) => {
            const previewBox = document.getElementById('novel-frame-preview-box');
            const previewAvatar = document.getElementById('novel-frame-preview-avatar');
            if (!previewBox) return;
            const oldImg = previewBox.querySelector('img:not(.novel-preview-frame-img)');
            if (oldImg) oldImg.remove();
            const url = e.target.value.trim();
            if (url) {
                if (previewAvatar) previewAvatar.style.display = 'none';
                const img = document.createElement('img');
                img.src = url;
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0;z-index:1;';
                img.onerror = () => {
                    img.remove();
                    if (previewAvatar) {
                        previewAvatar.style.display = '';
                        previewAvatar.textContent = '❌';
                    }
                };
                previewBox.appendChild(img);
            } else {
                if (previewAvatar) {
                    previewAvatar.style.display = '';
                    previewAvatar.textContent = THEMES[state.settings.theme].emoji;
                }
            }
        };
    }

    // 🆕 主页面背景上传
    const mainBgUpload = document.getElementById('novel-main-bg-upload');
    const mainBgUploadBtn = document.getElementById('novel-main-bg-upload-btn');
    if (mainBgUploadBtn && mainBgUpload) {
        mainBgUploadBtn.onclick = () => mainBgUpload.click();
        mainBgUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    // 🆕 存到 IndexedDB
                    await saveAssetToDB('main_bg', ev.target.result);
                    // 🆕 settings 里只存引用标记
                    state.settings.mainBgImage = 'idb:main_bg';
                    saveExtensionSettings();
                    applyMainBgImage();
                    mainBgUploadBtn.textContent = '✓ 上传成功！';
                    setTimeout(() => {
                        closeSettingsDialog();
                        openSettingsDialog();
                    }, 500);
                } catch (err) {
                    alert('背景保存失败: ' + (err.message || err));
                }
            };
            reader.readAsDataURL(file);
        };
    }


    // 清除主页面背景
    const mainBgClearBtn = document.getElementById('novel-main-bg-clear-btn');
    if (mainBgClearBtn) {
        mainBgClearBtn.onclick = async () => {
            try {
                await deleteAssetFromDB('main_bg');  // 🆕 从 IndexedDB 删除
            } catch (e) { /* 静默处理 */ }
            state.settings.mainBgImage = '';
            saveExtensionSettings();
            closeSettingsDialog();
            openSettingsDialog();
        };
    }

    // 主页面背景透明度
    const mainOpacitySlider = document.getElementById('novel-main-opacity-slider');
    const mainOpacityValue = document.getElementById('novel-main-opacity-value');
    if (mainOpacitySlider && mainOpacityValue) {
        mainOpacitySlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            mainOpacityValue.textContent = val + '%';
            state.settings.mainBgOpacity = val / 100;
            applyMainBgImage();
        };
    }

    // 🔧 阅读器背景上传事件
    const readerBgUpload = document.getElementById('novel-reader-bg-upload');
    const readerBgUploadBtn = document.getElementById('novel-reader-bg-upload-btn');
    if (readerBgUploadBtn && readerBgUpload) {
        readerBgUploadBtn.onclick = () => readerBgUpload.click();
        readerBgUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    await saveAssetToDB('reader_bg', ev.target.result);
                    state.settings.readerBgImage = 'idb:reader_bg';
                    saveExtensionSettings();
                    readerBgUploadBtn.textContent = '✓ 上传成功！';
                    setTimeout(() => {
                        closeSettingsDialog();
                        openSettingsDialog();
                    }, 500);
                } catch (err) {
                    alert('阅读背景保存失败: ' + (err.message || err));
                }
            };
            reader.readAsDataURL(file);
        };
    }

    // 清除阅读背景
    const readerBgClearBtn = document.getElementById('novel-reader-bg-clear-btn');
    if (readerBgClearBtn) {
        readerBgClearBtn.onclick = async () => {
            try {
                await deleteAssetFromDB('reader_bg');
            } catch (e) { /* 静默处理 */ }
            state.settings.readerBgImage = '';
            saveExtensionSettings();
            closeSettingsDialog();
            openSettingsDialog();
        };
    }

    // 阅读背景透明度滑块
    const opacitySlider = document.getElementById('novel-reader-opacity-slider');
    const opacityValue = document.getElementById('novel-opacity-value');
    if (opacitySlider && opacityValue) {
        opacitySlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            opacityValue.textContent = val + '%';
            state.settings.readerBgOpacity = val / 100;
        };
    }

    // 🆕 阅读背景明暗度滑块
    const brightnessSlider = document.getElementById('novel-reader-brightness-slider');
    const brightnessValue = document.getElementById('novel-brightness-value');
    if (brightnessSlider && brightnessValue) {
        brightnessSlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            brightnessValue.textContent = val + '%';
            state.settings.readerBgBrightness = val / 100;
        };
    }
    // 🆕 行间距滑块
    const lineHeightSlider = document.getElementById('novel-line-height-slider');
    const lineHeightValue = document.getElementById('novel-line-height-value');
    if (lineHeightSlider && lineHeightValue) {
        lineHeightSlider.oninput = (e) => {
            const val = parseInt(e.target.value) / 10;
            lineHeightValue.textContent = val.toFixed(1);
            state.settings.readerLineHeight = val;
        };
    }

    // 🆕 段间距滑块
    const paraSpacingSlider = document.getElementById('novel-para-spacing-slider');
    const paraSpacingValue = document.getElementById('novel-para-spacing-value');
    if (paraSpacingSlider && paraSpacingValue) {
        paraSpacingSlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            paraSpacingValue.textContent = val + 'px';
            state.settings.readerParagraphSpacing = val;
        };
    }


    // 🔧 字体选择（支持多种方式）
    const fontFamilySelect = document.getElementById('novel-reader-font-family');
    const customFontNameInput = document.getElementById('novel-reader-custom-font-name');
    const customFontUrlInput = document.getElementById('novel-reader-custom-font-url');
    const fontUploadArea = document.getElementById('novel-reader-font-upload-area');

    if (fontFamilySelect) {
        fontFamilySelect.onchange = (e) => {
            const val = e.target.value;
            if (customFontNameInput) customFontNameInput.style.display = val === 'customName' ? 'block' : 'none';
            if (customFontUrlInput) customFontUrlInput.style.display = val === 'customUrl' ? 'block' : 'none';
            if (fontUploadArea) fontUploadArea.style.display = val === 'customUpload' ? 'block' : 'none';
            const fontCssArea = document.getElementById('novel-reader-font-css-area');
            if (fontCssArea) fontCssArea.style.display = val === 'cssImport' ? 'block' : 'none';
        };
    }

    // 🔧 字体文件上传
    const fontUploadInput = document.getElementById('novel-reader-font-upload-input');
    const fontUploadBtn = document.getElementById('novel-reader-font-upload-btn');
    if (fontUploadBtn && fontUploadInput) {
        fontUploadBtn.onclick = () => fontUploadInput.click();
        fontUploadInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    await saveAssetToDB('custom_font', ev.target.result);
                    state.settings.readerCustomFontUrl = 'idb:custom_font';
                    saveExtensionSettings();
                    fontUploadBtn.textContent = '✓ 上传成功！';
                } catch (err) {
                    alert('字体保存失败: ' + (err.message || err));
                }
            };
            reader.readAsDataURL(file);
        };
    }

    // 🆕 猫耳外框显隐
    const badgeEarsCheck = document.getElementById('novel-badge-ears-visible');
    if (badgeEarsCheck) {
        badgeEarsCheck.onchange = (e) => {
            state.settings.badgeEarsVisible = e.target.checked;
            // 实时更新预览
            const earLeft = document.getElementById('novel-frame-preview-ear-left');
            const earRight = document.getElementById('novel-frame-preview-ear-right');
            const previewBox = document.getElementById('novel-frame-preview-box');
            if (earLeft) earLeft.style.display = e.target.checked ? '' : 'none';
            if (earRight) earRight.style.display = e.target.checked ? '' : 'none';
            if (previewBox) previewBox.style.borderWidth = e.target.checked ? '4px' : '0px';
        };
    }

    // 🆕 头像框类型切换
    dialog.querySelectorAll('input[name="novel-frame-type"]').forEach(radio => {
        radio.onchange = (e) => {
            const val = e.target.value;
            const frameUrlInput = document.getElementById('novel-frame-url');
            const frameUploadArea = document.getElementById('novel-frame-upload-area');
            const frameControls = dialog.querySelector('.novel-frame-controls');
            if (frameUrlInput) frameUrlInput.style.display = val === 'url' ? 'block' : 'none';
            if (frameUploadArea) frameUploadArea.style.display = val === 'upload' ? 'block' : 'none';
            if (frameControls) frameControls.style.display = val !== 'none' ? 'block' : 'none';
            state.settings.avatarFrameType = val;
            updateFramePreview();
        };
    });

    // 头像框上传
    const frameUploadInput = document.getElementById('novel-frame-upload-input');
    const frameUploadBtn = document.getElementById('novel-frame-upload-btn');
    if (frameUploadBtn && frameUploadInput) {
        frameUploadBtn.onclick = () => frameUploadInput.click();
        frameUploadInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target.result;
                try {
                    await saveAssetToDB('avatar_frame', dataUrl);
                    state.settings.avatarFrame = 'idb:avatar_frame';
                    saveExtensionSettings();
                } catch (err) {
                    // 回退
                    state.settings.avatarFrame = dataUrl;
                }
                frameUploadBtn.textContent = '✓ 上传成功！';
                updateFramePreview();
            };
            reader.readAsDataURL(file);
        };
    }

    // 头像框 URL 输入
    const frameUrlInput = document.getElementById('novel-frame-url');
    if (frameUrlInput) {
        frameUrlInput.oninput = (e) => {
            state.settings.avatarFrame = e.target.value.trim();
            updateFramePreview();
        };
    }

    // 头像框显隐
    const frameVisibleCheck = document.getElementById('novel-frame-visible');
    if (frameVisibleCheck) {
        frameVisibleCheck.onchange = (e) => {
            state.settings.avatarFrameVisible = e.target.checked;
            updateFramePreview();
        };
    }

    // 头像框位置
    const framePositionSelect = document.getElementById('novel-frame-position');
    if (framePositionSelect) {
        framePositionSelect.onchange = (e) => {
            state.settings.avatarFramePosition = e.target.value;
            updateFramePreview();
        };
    }

    // 头像框大小
    const frameSizeSlider = document.getElementById('novel-frame-size-slider');
    const frameSizeValue = document.getElementById('novel-frame-size-value');
    if (frameSizeSlider && frameSizeValue) {
        frameSizeSlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            frameSizeValue.textContent = val + '%';
            state.settings.avatarFrameSize = val;
            updateFramePreview();
        };
    }

    // 头像框水平偏移
    const frameXSlider = document.getElementById('novel-frame-x-slider');
    const frameXValue = document.getElementById('novel-frame-x-value');
    if (frameXSlider && frameXValue) {
        frameXSlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            frameXValue.textContent = val + 'px';
            state.settings.avatarFrameOffsetX = val;
            updateFramePreview();
        };
    }

    // 头像框垂直偏移
    const frameYSlider = document.getElementById('novel-frame-y-slider');
    const frameYValue = document.getElementById('novel-frame-y-value');
    if (frameYSlider && frameYValue) {
        frameYSlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            frameYValue.textContent = val + 'px';
            state.settings.avatarFrameOffsetY = val;
            updateFramePreview();
        };
    }

    // 🆕 实时预览更新函数（头像框部分）- 修复居中定位
    function updateFramePreview() {
        const previewBox = document.getElementById('novel-frame-preview-box');
        if (!previewBox) return;

        // 清理旧的头像框图片
        const oldFrame = previewBox.querySelector('.novel-preview-frame-img');
        if (oldFrame) oldFrame.remove();

        const { avatarFrame, avatarFrameType, avatarFrameVisible, avatarFramePosition, avatarFrameSize, avatarFrameOffsetX, avatarFrameOffsetY } = state.settings;

        if (avatarFrameVisible && avatarFrame && (avatarFrameType === 'url' || avatarFrameType === 'upload')) {
            const frame = document.createElement('img');
            frame.className = 'novel-preview-frame-img';
            frame.src = resolveAsset(avatarFrame);

            // 🔧 修改：使用居中定位 + calc 处理偏移，确保预览和实际一致
            frame.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(calc(-50% + ${avatarFrameOffsetX || 0}px), calc(-50% + ${avatarFrameOffsetY || 0}px));
                width: ${avatarFrameSize || 100}%;
                height: ${avatarFrameSize || 100}%;
                pointer-events: none;
                z-index: ${avatarFramePosition === 'front' ? '10' : '-1'};
                object-fit: contain;
            `;
            frame.onerror = () => frame.remove();
            previewBox.appendChild(frame);
        }
    }

    // 初始化预览
    updateFramePreview();

    // ==================== 保存按钮 ====================
    document.getElementById('novel-settings-save').onclick = () => {
        const theme = dialog.querySelector('input[name="novel-theme"]:checked').value;
        const badgeSize = dialog.querySelector('input[name="novel-badge-size"]:checked').value;
        const avatarType = dialog.querySelector('input[name="novel-avatar-type"]:checked').value;
        let avatarVal = '';
        if (avatarType === 'emoji') {
            avatarVal = document.getElementById('novel-avatar-emoji').value.trim() || THEMES[theme].emoji;
        } else if (avatarType === 'url') {
            avatarVal = document.getElementById('novel-avatar-url').value.trim();
        } else if (avatarType === 'upload') {
            // 🔧 保持 IDB 引用不变，不覆盖
            avatarVal = state.settings.avatarValue;  // 这里可能是 'idb:avatar_img'，保持原样即可
        }

        state.settings.theme = theme;
        state.settings.badgeSize = badgeSize;
        state.settings.avatarType = avatarType;
        state.settings.avatarValue = avatarVal;
        
        // 🆕 保存猫耳外框显隐
        const badgeEarsEl = document.getElementById('novel-badge-ears-visible');
        if (badgeEarsEl) {
            state.settings.badgeEarsVisible = badgeEarsEl.checked;
        }
        
        // 🆕 保存头像框设置
        const frameType = dialog.querySelector('input[name="novel-frame-type"]:checked').value;
        state.settings.avatarFrameType = frameType;
        if (frameType === 'url') {
            state.settings.avatarFrame = document.getElementById('novel-frame-url').value.trim();
        }
        
        // 🔧 保存阅读器设置
        state.settings.readerFontFamily = document.getElementById('novel-reader-font-family').value;

        if (state.settings.readerFontFamily === 'customName') {
            state.settings.readerCustomFont = document.getElementById('novel-reader-custom-font-name').value.trim();
        } else if (state.settings.readerFontFamily === 'customUrl') {
            state.settings.readerCustomFontUrl = document.getElementById('novel-reader-custom-font-url').value.trim();
        } else if (state.settings.readerFontFamily === 'cssImport') {
            const cssInput = document.getElementById('novel-reader-font-css-input');
            if (cssInput) {
                state.settings.readerFontImportCSS = cssInput.value.trim();
            }
        }

        applyTheme();
        applyReaderStyles();
        if (floatBadgeElement) {
            floatBadgeElement.setAttribute('data-size', badgeSize);
            updateBadgeAvatar();
        }
        saveExtensionSettings();
        closeSettingsDialog();
    };
}

function closeSettingsDialog() {
    if (settingsDialogElement) {
        settingsDialogElement.remove();
        settingsDialogElement = null;
    }
}

// ==================== 说明手册 ====================
function openHelpDialog() {
    if (helpDialogElement) {
        helpDialogElement.remove();
        helpDialogElement = null;
        return;
    }

    helpDialogElement = document.createElement('div');
    helpDialogElement.className = 'novel-dialog-mask';
    helpDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    helpDialogElement.innerHTML = `
        <div class="novel-dialog-box" style="width: 420px; max-height:82vh;">
            <div class="novel-dialog-header">
                <span>📖 萌猫小说阅读器完全指南</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body" style="font-size:12px; line-height:1.9; overflow-y:auto; max-height:70vh;">
                
                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:12px;">🐾 快速开始</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li>首次使用点击侧边栏"唤醒小说阅读器"按钮，或点击悬浮球打开面板</li>
                    <li>点击"导入 TXT"选择本地小说文件，系统将自动解析章节</li>
                    <li>点击书籍封面即可开始沉浸式阅读</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">📚 书籍管理</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>导入小说：</b>支持 .txt 格式，提供 4 种切章方式（正则表达式、固定字数、智能空行、不切章）</li>
                    <li><b>封面自定义：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>桌面端：右键点击书籍封面</li>
                            <li>移动端：长按书籍封面（0.5秒触发）</li>
                        </ul>
                        可选择默认渐变色、自定义文字/Emoji、或上传图片
                    </li>
                    <li><b>重命名：</b>点击"改名"按钮或双击书名</li>
                    <li><b>删除书籍：</b>点击"删除"按钮（包括所有章节数据）</li>
                    <li><b>搜索：</b>顶部搜索栏输入书名，匹配内容高亮显示</li>
                    <li><b>布局切换：</b>点击"⚃"按钮在列表/网格视图间切换</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">📖 阅读器操作</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>唤醒菜单：</b>点击阅读区域中央，弹出顶部/底部操作菜单</li>
                    <li><b>字体大小：</b>点击 A- 缩小，A+ 放大（12px-36px 范围）</li>
                    <li><b>章节导航：</b>"上一章"/"下一章"按钮快速翻页</li>
                    <li><b>目录跳转：</b>点击"📖 目录"打开章节列表，点击章节标题即可跳转</li>
                    <li><b>退出阅读：</b>点击"↩ 退出"返回书架</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">🎨 主题与外观</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>主题配色：</b>提供 10 种精美主题（樱花粉、嫩黄、淡绿、毛玻璃、夜樱、深海蓝、落日橘、薰衣草、摩卡棕）</li>
                    <li><b>边框纹理：</b>上传图片作为面板边框装饰，可选"保留猫耳边框"或"整片铺满"模式</li>
                    <li><b>悬浮球尺寸：</b>大（72px）、中（58px）、小（44px）三档调节</li>
                    <li><b>悬浮球头像：</b>支持 Emoji/颜文字、网络图片链接、本地图片上传</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">🖌️ 阅读器自定义</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>阅读背景：</b>上传背景图片，通过透明度滑块调节（0-100%），半透明遮罩确保文字清晰</li>
                    <li><b>阅读字体：</b>支持多种方式
                        <ul style="margin:6px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>系统预设：默认/宋体/黑体/楷体/仿宋</li>
                            <li>系统字体名称：输入已安装字体（如"霞鹜文楷"）</li>
                            <li>网络字体链接：输入 .woff2/.ttf 字体 URL</li>
                            <li>本地字体上传：直接上传字体文件（Base64 存储）</li>
                        </ul>
                    </li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">💾 备份与还原</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>备份：</b>点击"备份"按钮导出 JSON 文件，包含所有书籍、章节内容和阅读进度</li>
                    <li><b>还原：</b>点击"还原"选择备份文件，自动恢复数据（支持跨设备迁移）</li>
                    <li><b>数据安全：</b>使用 IndexedDB 本地存储，浏览器清理缓存前请务必备份</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">💡 实用技巧</p>
                <ul style="margin:0 0 8px 0; padding-left:20px;">
                    <li>拖拽面板头部或悬浮球可自由移动位置</li>
                    <li>面板右下角可调整大小（移动端自适应）</li>
                    <li>正则切章推荐使用默认规则，适配大部分国内小说</li>
                    <li>目录支持大量章节分批加载，避免卡顿</li>
                    <li>深色主题（夜樱/毛玻璃黑/摩卡）自动优化阅读文字对比度</li>
                </ul>

                <p style="text-align:center; margin-top:20px; padding-top:16px; border-top:1px dashed var(--kp-border); color:var(--kp-text-muted); font-size:10px;">
                    🐾 萌猫小说阅读器 v2.0.0<br>
                    祝您阅读愉快！
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(helpDialogElement);
    applyTheme();
    
    helpDialogElement.querySelector('.novel-dialog-close').onclick = () => {
        helpDialogElement.remove();
        helpDialogElement = null;
    };
}



// ==================== 拖拽系统 ====================
function initDragSystem(panel, handle, isBadge) {
    if (!handle) return;
    let isDragging = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let moveHandler = null;
    let endHandler = null;
    const DRAG_THRESHOLD = 5;

    const start = (clientX, clientY, e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            return false;
        }
        isDragging = true;
        hasMoved = false;
        if (isBadge) panel.dataset.dragging = 'true';
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startX = clientX;
        startY = clientY;

        panel.style.left = startLeft + 'px';
        panel.style.top = startTop + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.classList.add('novel-is-dragging');
        return true;
    };

    const move = (clientX, clientY) => {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        if (!hasMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
            hasMoved = true;
        }
        if (!hasMoved) return;
        panel.style.left = (startLeft + dx) + 'px';
        panel.style.top = (startTop + dy) + 'px';
    };

    const end = () => {
        if (!isDragging) return;
        const wasMoved = hasMoved;
        isDragging = false;
        hasMoved = false;
        panel.classList.remove('novel-is-dragging');
        if (moveHandler) {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('touchmove', moveHandler);
        }
        if (isBadge) {
            if (wasMoved) {
                panel.dataset.dragging = 'true';
                setTimeout(() => { if (floatBadgeElement) panel.dataset.dragging = 'false'; }, 100);
                saveExtensionSettings();
            } else {
                panel.dataset.dragging = 'false';
            }
        } else {
            saveExtensionSettings();
        }
    };

    handle.addEventListener('mousedown', (e) => {
        if (!start(e.clientX, e.clientY, e)) return;
        moveHandler = (ev) => move(ev.clientX, ev.clientY);
        endHandler = () => end();
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
    });

    handle.addEventListener('touchstart', (e) => {
        if (!e.touches[0]) return;
        if (!start(e.touches[0].clientX, e.touches[0].clientY, e)) return;
        moveHandler = (ev) => { if (ev.touches[0]) move(ev.touches[0].clientX, ev.touches[0].clientY); };
        endHandler = () => end();
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);
    }, { passive: false });
}

// ==================== 悬浮状态 ====================
function enterFloatingState() {
    state.isFloating = true;
    let badgeLeft = null, badgeTop = null;
    if (panelElement && panelElement.style.display !== 'none') {
        // 仅当面板可见时，才基于面板位置计算悬浮球坐标
        const rect = panelElement.getBoundingClientRect();
        state.savedPos = { left: rect.left, top: rect.top };
        const dim = BADGE_DIMENSIONS[state.settings.badgeSize] || BADGE_DIMENSIONS.medium;
        badgeLeft = rect.left + rect.width / 2 - dim.w / 2;
        badgeTop = rect.top + rect.height / 2 - dim.h / 2;
    }
    if (panelElement) {
        panelElement.style.display = 'none';
    }
    createFloatBadge(badgeLeft, badgeTop);
    saveExtensionSettings();
}

function exitFloatingState() {
    state.isFloating = false;
    if (floatBadgeElement) floatBadgeElement.style.display = 'none';
    panelElement.style.display = 'flex';
    renderShelf();
    saveExtensionSettings();
}

function createFloatBadge(customLeft = null, customTop = null) {
    if (document.getElementById('novel-ext-float-badge')) {
        floatBadgeElement.style.display = 'block';
        return;
    }

    floatBadgeElement = document.createElement('div');
    floatBadgeElement.id = 'novel-ext-float-badge';
    floatBadgeElement.dataset.dragging = 'false';
    floatBadgeElement.setAttribute('data-size', state.settings.badgeSize);
    floatBadgeElement.setAttribute('data-novel-theme', state.settings.theme);

    const isMobile = window.innerWidth <= 768;
    const left = customLeft !== null ? customLeft + 'px' : (isMobile ? '15px' : '40px');
    const top = customTop !== null ? customTop + 'px' : '40%';

    floatBadgeElement.style.cssText = `
        position: fixed !important;
        left: ${left} !important;
        top: ${top} !important;
        z-index: 100000 !important;
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
    `;

    floatBadgeElement.innerHTML = `
        <div class="novel-badge-container">
            <div class="novel-badge-ear left"></div>
            <div class="novel-badge-ear right"></div>
            <div class="novel-badge-circle">
                <div class="novel-badge-text-face"></div>
            </div>
        </div>
    `;

    document.body.appendChild(floatBadgeElement);
    applyTheme();

    let downX = 0, downY = 0, downTime = 0;
    const onDown = (x, y) => { downX = x; downY = y; downTime = Date.now(); };
    const onUp = (x, y) => {
        const dx = Math.abs(x - downX);
        const dy = Math.abs(y - downY);
        const dt = Date.now() - downTime;
        if (dx < 10 && dy < 10 && dt < 500) {
            exitFloatingState();
        }
    };

    floatBadgeElement.addEventListener('touchstart', (e) => {
        if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
    });
    floatBadgeElement.addEventListener('touchend', (e) => {
        if (e.changedTouches[0]) onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });
    floatBadgeElement.addEventListener('mousedown', (e) => { if (e.button === 0) onDown(e.clientX, e.clientY); });
    floatBadgeElement.addEventListener('mouseup', (e) => { if (e.button === 0) onUp(e.clientX, e.clientY); });

    initDragSystem(floatBadgeElement, floatBadgeElement, true);
}

function toggleMainPanel() {
    if (state.isFloating) {
        exitFloatingState();
    } else if (panelElement) {
        panelElement.style.display = panelElement.style.display === 'none' ? 'flex' : 'none';
    } else {
        createPanel();
    }
}

// ==================== 初始化 ====================
async function initExtension() {
    try {
        await initIndexedDB();
        await preloadAllAssets();
        loadExtensionSettings();

        // 🆕 自动迁移旧版封面数据
        await migrateBookCoversToIndexedDB();
        await migrateAssetsToIndexedDB();

        // 🔧 根据启用状态和设置决定启动方式
        createPanel();
        applyTheme();

        if (!state.settings.enabled) {
            // 默认禁用状态：隐藏一切 UI
            panelElement.style.display = 'none';
            state.isFloating = true;
        } else if (state.settings.startAsFloating) {
            // 已启用 + 悬浮球模式
            panelElement.style.display = 'none';
            state.isFloating = true;
            createFloatBadge();
        } else {
            // 已启用 + 面板模式
            // 什么都不做，面板已经显示
        }


        // 在 ST 菜单侧边栏注入开关
        let attempts = 0;
        const injectInterval = setInterval(() => {
            attempts++;
            const menu = document.getElementById('extensions_settings');
            if (menu && !document.getElementById('novel-ext-nav-section')) {
                menu.insertAdjacentHTML('afterbegin', `
                    <div class="inline-drawer" id="novel-ext-nav-section">
                        <div class="novel-ext-menu-header" id="novel-ext-menu-header">
                            <div class="novel-ext-menu-icon">📚</div>
                            <div class="novel-ext-menu-title-area">
                                <span class="novel-ext-menu-title">萌猫小说阅读器</span>
                                <span class="novel-ext-menu-subtitle">Novel Reader v2.0</span>
                            </div>
                            <label class="novel-ext-toggle-switch" title="启用/禁用插件">
                                <input type="checkbox" id="novel-ext-enable-toggle" ${state.settings.enabled ? 'checked' : ''}>
                                <span class="novel-ext-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="novel-ext-menu-body" id="novel-ext-menu-body" style="display: ${state.settings.enabled ? 'block' : 'none'};">
                            <div class="novel-ext-menu-desc">
                                <span>🐾 支持 TXT 导入、多主题切换、自定义字体与背景</span>
                            </div>
                            <button id="novel-ext-open-btn" class="novel-ext-menu-open-btn" type="button">
                                <span class="novel-ext-btn-icon">🐱</span>
                                <span>打开阅读器</span>
                            </button>
                        </div>
                    </div>
                `);

                // 启用开关事件
                const enableToggle = document.getElementById('novel-ext-enable-toggle');
                enableToggle.onchange = (e) => {
                    state.settings.enabled = e.target.checked;
                    const menuBody = document.getElementById('novel-ext-menu-body');
                    if (e.target.checked) {
                        menuBody.style.display = 'block';
                        // 启用时如果面板和悬浮球都不在，就创建悬浮球
                        if (!panelElement || panelElement.style.display === 'none') {
                            if (!floatBadgeElement || floatBadgeElement.style.display === 'none') {
                                enterFloatingState();
                            }
                        }
                    } else {
                        menuBody.style.display = 'none';
                        // 禁用时隐藏面板和悬浮球
                        if (panelElement) panelElement.style.display = 'none';
                        if (floatBadgeElement) floatBadgeElement.style.display = 'none';
                    }
                    saveExtensionSettings();
                };

                // 打开阅读器按钮事件
                const openBtn = document.getElementById('novel-ext-open-btn');
                openBtn.onclick = toggleMainPanel;
            }
            if (document.getElementById('novel-ext-nav-section') || attempts > 20) {
                clearInterval(injectInterval);
            }
        }, 1000);
    } catch (err) {
        handleError(err, '插件初始化失败');
    }
}



if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initExtension();
} else {
    document.addEventListener('DOMContentLoaded', initExtension);
}
