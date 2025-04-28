import {useState} from 'react'
import {XIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";

// یک آرایه رنگی یا هرچیزی نداریم فعلاً. فقط فایل آپلود

export default function UploadModalImage({ openUploadImage, setOpenUploadImage, editor,lang}) {
    // تب فعال را نگه می‌داریم: 'upload' یا 'url'
    const [activeTab, setActiveTab] = useState('url')

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
            className="tw:fixed tw:inset-0 tw:z-40 tw:backdrop-blur-xs tw:flex tw:items-center tw:justify-center tw:px-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="tw:bg-white tw:dark:bg-gray-600  tw:border tw:border-gray-200 tw:dark:border-gray-700 tw:p-5 tw:w-full tw:max-w-2xl tw:flex tw:flex-col tw:gap-4 tw:md:my-10 tw:rounded tw:relative">
                {/* هدر مودال */}
                <div className="tw:flex tw:flex-row tw:justify-between tw:items-center">
                    <span className="tw:font-bold tw:dark:text-gray-200">{t('addImage', lang)}</span>
                    <span
                        onClick={() => setOpenUploadImage(false)}
                        className="tw:cursor-pointer tw:text-gray-700 tw:hover:text-gray-500"
                    >
            <XIcon/>
          </span>
                </div>
                <div className="tw:flex tw:border-b tw:border-gray-300 tw:dark:border-gray-700 tw:mb-2">
                    {/*<div onClick={() => setActiveTab('upload')} className={`tw:py-2 tw:px-4 ${activeTab === 'upload' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}>*/}
                    {/*    {t('uploadFile', lang)}*/}
                    {/*</div>*/}
                    <div onClick={() => setActiveTab('url')} className={`tw:py-2 tw:px-4 ${activeTab === 'url' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}>
                        {t('directLink', lang)}
                    </div>
                </div>

                {/* محتوای تب‌ها */}
                {activeTab === 'upload' && (
                    <div>
                        <div className="tw:flex tw:flex-col tw:text-gray-500 tw:justify-center tw:items-center tw:border-2 tw:border-dashed tw:border-gray-500 tw:rounded-xl tw:h-30 tw:hover:border-gray-700 tw:hover:bg-gray-200 tw:dark:bg-gray-700 tw:hover:dark:bg-gray-800 tw:cursor-pointer tw:p-5" onClick={() => {document.getElementById('fileInput').click()}}>
                            {t('dragUpload', lang)}
                            <input id="fileInput" type="file" multiple className="tw:hidden" onChange={handleFileSelect} />
                        </div>

                        {/* پیش‌نمایش تصاویر انتخاب شده */}
                        {images.length > 0 && (
                            <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                                {images.map((file, index) => (
                                    <div key={index} className="tw:relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="tw:w-20 tw:h-20 tw:object-cover tw:rounded"
                                        />
                                        <div
                                            className="tw:absolute tw:top-1 tw:right-1 tw:bg-red-500 tw:hover:bg-red-400 tw:text-white tw:rounded-full tw:p-1 tw:text-xs tw:cursor-pointer"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            حذف
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* نوار پیشرفت آپلود (در صورت در حال آپلود بودن) */}
                        {isUploading && (
                            <div className="tw:w-full tw:bg-gray-200 tw:dark:bg-gray-800 tw:rounded tw:h-4 tw:mt-2">
                                <div className="tw:bg-blue-500 tw:h-4 tw:rounded" style={{ width: `${uploadProgress}%` }}>
                                </div>
                            </div>
                        )}

                        <div className="tw:flex tw:gap-2 tw:mt-4">
                            <label className="tw:flex tw:flex-col tw:text-sm">
                                {t('alt', lang)}
                                <input
                                    type="text" value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className="tw:border tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm"
                                />
                            </label>
                        </div>

                        {/* دکمه آپلود و بستن */}
                        <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <div className="tw:rounded tw:bg-green-500 tw:hover:bg-green-400 tw:px-4 tw:py-2 tw:text-white" onClick={handleUpload} disabled={isUploading}>
                                {t('add', lang)}
                            </div>
                            <div className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => setOpenUploadImage(false)}>
                                {t('close', lang)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'url' && (
                    <div>

                        <div className="tw:flex tw:flex-col tw:gap-3">
                            <div className="tw:flex tw:flex-col tw:gap-1">
                                <label className="tw:flex tw:flex-col tw:dark:text-gray-200 tw:text-sm ">
                                    {t('addressFile', lang)}

                                </label>
                                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="tw:border tw:dark:text-gray-300 tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm" placeholder={t('addAddressFile', lang)}/>
                            </div>
                            <div className="tw:flex tw:flex-col tw:gap-1">
                                <label className="tw:flex tw:flex-col tw:dark:text-gray-200 tw:text-sm">
                                    {t('alt', lang)}
                                </label>
                                <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="tw:border tw:dark:text-gray-300 tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm"/>

                            </div>
                        </div>

                        <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <div className="tw:rounded tw:bg-blue-500 tw:hover:bg-blue-400 tw:px-4 tw:py-2 tw:text-white" onClick={handleInsertImageFromUrl}>
                                {t('add', lang)}
                            </div>
                            <div className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => setOpenUploadImage(false)}>
                                {t('close', lang)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
