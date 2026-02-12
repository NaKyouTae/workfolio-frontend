const fs = require('fs');
const path = require('path');

function copyDir(src, dest, excludes = []) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        if (excludes.includes(entry.name)) continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const ROOT = '/Users/nakyutae/personal/git/workfolio-frontend';
const DEST = ROOT + '/apps/app';

// 1. Copy src/app/ excluding admin
copyDir(ROOT + '/src/app', DEST + '/src/app', ['admin']);
console.log('Copied src/app/ (excluding admin)');

// 2. Copy portal/layouts -> components/layouts
copyDir(ROOT + '/src/components/portal/layouts', DEST + '/src/components/layouts');
console.log('Copied portal/layouts');

// 3. Copy portal/features -> components/features
copyDir(ROOT + '/src/components/portal/features', DEST + '/src/components/features');
console.log('Copied portal/features');

// 4. Copy hooks excluding shared ones
const excludedHooks = ['usePlans.ts', 'useFeatures.ts', 'usePlanFeatures.ts', 'useConfirm.tsx', 'useNotification.tsx', 'useModal.tsx', 'useGuide.tsx'];
copyDir(ROOT + '/src/hooks', DEST + '/src/hooks', excludedHooks);
console.log('Copied hooks (excluding shared)');

// 5. Copy sample data files
const sampleFiles = ['sampleCareerData.ts', 'sampleRecordData.ts', 'sampleTurnOverData.ts'];
fs.mkdirSync(DEST + '/src/utils', { recursive: true });
for (const f of sampleFiles) {
    fs.copyFileSync(ROOT + '/src/utils/' + f, DEST + '/src/utils/' + f);
}
console.log('Copied sample data files');

// 6. Copy public/
copyDir(ROOT + '/public', DEST + '/public');
console.log('Copied public/');

console.log('All done!');
