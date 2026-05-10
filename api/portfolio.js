// api/portfolio.js
import { writeFile, deleteFile } from './github.js';

export default async function handler(req, res) {
    // В продакшене здесь должна быть проверка пароля (isAdminRequest)
    
    try {
        if (req.method === 'POST') {
            const item = req.body;
            if (!item.title) throw new Error("Title is required");
            
            // Генерируем имя файла на основе заголовка
            const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const path = `content/portfolio/${slug}.json`;
            
            await writeFile({
                path,
                content: JSON.stringify(item, null, 2),
                message: `cms: add portfolio project ${item.title}`
            });
            
            return res.status(200).json({ success: true, path });
        }
        
        if (req.method === 'DELETE') {
            const { path } = req.body;
            await deleteFile({ path, message: `cms: delete portfolio project` });
            return res.status(200).json({ success: true });
        }
        
        res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
