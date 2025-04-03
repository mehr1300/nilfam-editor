import {useState} from 'react'
import {XIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";

// یک آرایه رنگی یا هرچیزی نداریم فعلاً. فقط فایل آپلود

export default function UploadModalImage({ openUploadImage, setOpenUploadImage, editor,lang}) {
    // تب فعال را نگه می‌داریم: 'upload' یا 'url'
    const [activeTab, setActiveTab] = useState('upload')

    // ---- states تب آپلود ----
    const [images, setImages] = useState([])
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    // ---- states تب لینک مستقیم ----
    const [imageUrl, setImageUrl] = useState('')

    // ---- فیلدهای عمومی برای درج در ادیتور ----
    const [altText, setAltText] = useState('')
    const [imageWidth, setImageWidth] = useState('500') // پیش‌فرض 500px

    // جلوگیری از باز شدن عکس به‌صورت پیش‌فرض در تب جدید هنگام درگ‌ودراپ
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // دراپ کردن فایل‌ها در ناحیه:
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const droppedFiles = Array.from(e.dataTransfer.files)
        const validImages = droppedFiles.filter((file) => file.type.startsWith('image/'))
        setImages((prev) => [...prev, ...validImages])
    }

    // انتخاب فایل‌ها از طریق کلیک و باز کردن فایل منیجر (اختیاری)
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const validImages = selectedFiles.filter((file) => file.type.startsWith('image/'))
        setImages((prev) => [...prev, ...validImages])
    }

    // حذف یک عکس از لیست آپلود
    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    // تابع آپلود (شبیه‌سازی یا واقعی)
    const handleUpload = async () => {
        if (!images.length) return

        setIsUploading(true)
        setUploadProgress(0)

        // شبیه‌سازی پیشرفت آپلود
        let fakeProgress = 0
        const interval = setInterval(() => {
            fakeProgress += 10
            setUploadProgress(fakeProgress)
            if (fakeProgress >= 100) {
                clearInterval(interval)
            }
        }, 500)

        // ساخت FormData برای ارسال همه فایل‌ها به بک‌اند
        const formData = new FormData()
        images.forEach((image) => {
            formData.append('images', image)
        })

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                // پاسخ سرور مثلاً باید آدرس فایل آپلود شده را بدهد
                // به عنوان مثال فرض کنیم پاسخ چنین ساختاری داشته باشد:
                // { success: true, url: 'https://server.com/images/xxxx.jpg' }
                const data = await res.json()

                // حالا می‌توانید عکس را در ادیتور درج کنید
                // در اینجا فقط یک عکس را درج می‌کنیم؛
                // درصورت نیاز لیستی از عکس‌ها را می‌توانید مدیریت کنید
                if (data?.url) {
                    insertImageInEditor(data.url)
                }
            } else {
                console.log('Upload error', res.status)
            }
        } catch (error) {
            console.log('Fetch error', error)
        } finally {
            setTimeout(() => {
                setIsUploading(false)
                // پس از اتمام آپلود، مودال را می‌بندیم (دلخواه)
                setOpenUploadImage(false)
            }, 1500)
        }
    }

    // متدی برای درج عکس در ادیتور
    const insertImageInEditor = (src) => {
        if (!editor) return
        editor.chain().focus().setImage({
            src,
            alt: altText || '',
            // می‌توانید عرض/ارتفاع یا استایل دلخواه بفرستید
            style: `width: ${imageWidth}px; max-width: 100%;`
        }).run()
    }

    // زمانی که روی دکمه «درج در ادیتور» در تب لینک مستقیم کلیک می‌شود
    const handleInsertImageFromUrl = () => {
        if (!imageUrl) return
        // درج در ادیتور
        insertImageInEditor(imageUrl)
        // بستن مودال
        setOpenUploadImage(false)
    }

    // اگر مودال باز نیست، هیچی رندر نکن
    if (!openUploadImage) return null

    return (
        <div
            className="fixed inset-0 z-40 backdrop-blur-xs flex items-center justify-center px-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="bg-white border border-gray-200 p-5 w-full max-w-2xl flex flex-col gap-4 md:my-10 rounded relative">
                {/* هدر مودال */}
                <div className="flex flex-row justify-between items-center">
                    <span className="font-bold">{t('addImage', lang)}</span>
                    <span
                        onClick={() => setOpenUploadImage(false)}
                        className="cursor-pointer text-gray-700 hover:text-gray-500"
                    >
            <XIcon/>
          </span>
                </div>
                <div className="flex border-b border-gray-300 mb-2">
                    <button onClick={() => setActiveTab('upload')} className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}>
                        {t('uploadFile', lang)}
                    </button>
                    <button onClick={() => setActiveTab('url')} className={`py-2 px-4 ${activeTab === 'url' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}>
                        {t('directLink', lang)}
                    </button>
                </div>

                {/* محتوای تب‌ها */}
                {activeTab === 'upload' && (
                    <div>
                        <div className="flex flex-col text-gray-500 justify-center items-center border-2 border-dashed border-gray-500 rounded-xl h-30 hover:border-gray-700 hover:bg-gray-200 cursor-pointer p-5" onClick={() => {document.getElementById('fileInput').click()}}>
                            {t('dragUpload', lang)}
                            <input id="fileInput" type="file" multiple className="hidden" onChange={handleFileSelect} />
                        </div>

                        {/* پیش‌نمایش تصاویر انتخاب شده */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {images.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <button
                                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full p-1 text-xs cursor-pointer"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* نوار پیشرفت آپلود (در صورت در حال آپلود بودن) */}
                        {isUploading && (
                            <div className="w-full bg-gray-200 rounded h-4 mt-2">
                                <div className="bg-blue-500 h-4 rounded" style={{ width: `${uploadProgress}%` }}>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 mt-4">
                            <label className="flex flex-col text-sm">
                                {t('alt', lang)}
                                <input
                                    type="text" value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                />
                            </label>
                        </div>

                        {/* دکمه آپلود و بستن */}
                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className="rounded bg-green-500 hover:bg-green-400 px-4 py-2 text-white" onClick={handleUpload} disabled={isUploading}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => setOpenUploadImage(false)}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'url' && (
                    <div>
                        <label className="flex flex-col text-sm mb-2">
                            {t('addressFile', lang)}
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                placeholder=  {t('addAddressFile', lang)}
                            />
                        </label>

                        <div className="flex gap-2">
                            <label className="flex flex-col text-sm">
                                {t('alt', lang)}
                                <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="border border-gray-400 rounded px-2 py-1.5 text-sm"/>
                            </label>
                        </div>

                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className="rounded bg-blue-500 hover:bg-blue-400 px-4 py-2 text-white" onClick={handleInsertImageFromUrl}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => setOpenUploadImage(false)}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
