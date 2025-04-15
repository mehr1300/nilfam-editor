import {useState} from 'react'
import {XIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";

export default function UploadModalAudio({ openUploadAudio, setOpenUploadAudio, editor,lang}) {
    // نگه‌داری تب فعال: 'upload' یا 'url'
    const [activeTab, setActiveTab] = useState('upload')

    // حالت‌های مربوط به تب آپلود صدا
    const [audios, setAudios] = useState([])
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    // حالت‌های مربوط به تب لینک مستقیم
    const [audioUrl, setAudioUrl] = useState('')

    // فیلد عمومی برای توضیحات یا متن جایگزین
    const [altText, setAltText] = useState('')
    const [audioWidth, setAudioWidth] = useState('500') // پیش‌فرض 500px

    // جلوگیری از رفتار پیش‌فرض در هنگام درگ‌ودراپ
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // دراپ کردن فایل‌های صوتی
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const droppedFiles = Array.from(e.dataTransfer.files)
        const validAudios = droppedFiles.filter((file) => file.type.startsWith('audio/'))
        setAudios((prev) => [...prev, ...validAudios])
    }

    // انتخاب فایل‌های صوتی از طریق فایل منیجر
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const validAudios = selectedFiles.filter((file) => file.type.startsWith('audio/'))
        setAudios((prev) => [...prev, ...validAudios])
    }

    // حذف یک فایل صوتی از لیست
    const handleRemoveAudio = (index) => {
        setAudios((prev) => prev.filter((_, i) => i !== index))
    }

    // تابع آپلود (شبیه‌سازی یا واقعی)
    const handleUpload = async () => {
        if (!audios.length) return

        setIsUploading(true)
        setUploadProgress(0)

        // شبیه‌سازی پیشرفت آپلود
        let fakeProgress = 0
        const interval = setInterval(() => {
            fakeProgress += 10
            setUploadProgress(fakeProgress)
            if (fakeProgress >= 100) {
                clearInterval(interval)
                finishUpload();
            }
        }, 500)

        // ساخت FormData برای ارسال فایل‌های صوتی به بک‌اند
        const formData = new FormData()
        audios.forEach((audio) => {
            formData.append('audios', audio)
        })

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                const data = await res.json()
                // فرض بر این است که سرور آدرس فایل آپلود شده را برمی‌گرداند
                if (data?.url) {
                    insertAudioInEditor(data.url)
                }
            } else {
                console.error('Upload error', res.status)
                clearInterval(interval); // در صورت خطا، interval را پاک کنیم
                setIsUploading(false);
            }
        } catch (error) {
            console.error('Fetch error', error)
            clearInterval(interval); // در صورت خطا، interval را پاک کنیم
            setIsUploading(false);
        }
    }

    // تکمیل فرآیند آپلود
    const finishUpload = () => {
        setTimeout(() => {
            setIsUploading(false)
            // پس از پایان آپلود، مودال بسته می‌شود
            setOpenUploadAudio(false)
        }, 1000)
    }

    // تابع درج صدا در ادیتور
    const insertAudioInEditor = (src) => {
        if (!editor) return

        // بررسی اینکه آیا متد setAudio در ادیتور موجود است
        if (typeof editor.chain().focus().setAudio === 'function') {
            editor.chain().focus().setAudio({
                src,
                alt: altText || '',
                style: `width: ${audioWidth}px; max-width: 100%;`
            }).run()
        } else {
            // اگر متد setAudio موجود نیست، از تگ audio استفاده کنیم
            editor.chain().focus().insertContent(`
                <audio controls src="${src}" alt="${altText || ''}" style="width: ${audioWidth}px; max-width: 100%;">
                    Your browser does not support the audio element.
                </audio>
            `).run()
        }
    }

    // درج صدا از طریق لینک مستقیم
    const handleInsertAudioFromUrl = () => {
        if (!audioUrl) return
        insertAudioInEditor(audioUrl)
        setOpenUploadAudio(false)
    }

    // اگر مودال باز نیست، چیزی رندر نکن
    if (!openUploadAudio) return null

    return (
        <div
            className="tw:fixed tw:inset-0 tw:z-40 tw:backdrop-blur-xs tw:flex tw:items-center tw:justify-center tw:px-2"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setOpenUploadAudio(false)
                }
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="tw:bg-white tw:dark:bg-gray-600  tw:border tw:border-gray-200 tw:dark:border-gray-700 tw:p-5 tw:w-full tw:max-w-2xl tw:flex tw:flex-col tw:gap-4 tw:md:my-10 tw:rounded tw:relative" onClick={(e) => e.stopPropagation()}>
                {/* هدر مودال */}
                <div className="tw:flex tw:flex-row tw:justify-between tw:items-center">
                    <span className="tw:font-bold"> {t('addAudio', lang)}</span>
                    <span
                        onClick={() => setOpenUploadAudio(false)}
                        className="tw:cursor-pointer tw:text-gray-700 tw:hover:text-gray-500"
                    >
                        <XIcon/>
                    </span>
                </div>

                {/* تب‌ها */}
                <div className="tw:flex tw:border-b tw:border-gray-300 tw:dark:border-gray-700 tw:mb-2">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`tw:py-2 tw:px-4 ${activeTab === 'upload' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}
                    >
                        {t('uploadFile', lang)}
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`tw:py-2 tw:px-4 ${activeTab === 'url' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}
                    >
                        {t('directLink', lang)}
                    </button>
                </div>

                {/* محتوای تب‌ها */}
                {activeTab === 'upload' && (
                    <div>
                        {/* ناحیه درگ‌ودراپ */}
                        <div className="tw:flex tw:flex-col tw:text-gray-500 tw:justify-center tw:items-center tw:border-2 tw:border-dashed tw:border-gray-500 tw:rounded-xl tw:h-30 tw:hover:border-gray-700 tw:hover:bg-gray-200 tw:dark:bg-gray-700 tw:hover:dark:bg-gray-800 tw:cursor-pointer tw:p-5" onClick={() => document.getElementById('audioFileInput').click()}>
                            {t('dragUpload', lang)}
                            <input
                                id="audioFileInput"
                                type="file"
                                accept="audio/*"
                                multiple
                                className="tw:hidden"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* پیش‌نمایش فایل‌های صوتی انتخاب شده */}
                        {audios.length > 0 && (
                            <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                                {audios.map((file, index) => (
                                    <div key={index} className="tw:relative">
                                        <audio controls src={URL.createObjectURL(file)} className="w-60" />
                                        <button
                                            className="tw:absolute tw:top-1 tw:right-1 tw:bg-red-500 tw:hover:bg-red-400 tw:text-white tw:rounded-full tw:p-1 tw:text-xs tw:cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation(); // جلوگیری از bubble شدن کلیک
                                                handleRemoveAudio(index);
                                            }}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* نوار پیشرفت آپلود */}
                        {isUploading && (
                            <div className="tw:w-full tw:bg-gray-200 tw:dark:bg-gray-800 tw:rounded tw:h-4 tw:mt-2">
                                <div
                                    className="tw:bg-blue-500 tw:h-4 tw:rounded tw:transition-all tw:duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}

                        <div className="tw:flex tw:gap-2 tw:mt-4">
                            <label className="tw:flex tw:flex-col tw:text-sm">
                                {t('alt', lang)}
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className="tw:border tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm"
                                />
                            </label>

                        </div>

                        <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <button className={`tw:rounded tw:px-4 tw:py-2 tw:text-white ${isUploading || !audios.length ? 'tw:bg-green-300 tw:cursor-not-allowed' : 'tw:bg-green-500 tw:hover:bg-green-400'}`} onClick={handleUpload} disabled={isUploading || !audios.length}>
                                {t('add', lang)}
                            </button>
                            <button className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => setOpenUploadAudio(false)} disabled={isUploading}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'url' && (
                    <div>
                        <label className="tw:flex tw:flex-col tw:text-sm tw:mb-2">
                            {t('addressFile', lang)}
                            <input
                                type="text"
                                value={audioUrl}
                                onChange={(e) => setAudioUrl(e.target.value)}
                                className="tw:border tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm"
                                placeholder= {t('addAddressFile', lang)}
                            />
                        </label>

                        <div className="tw:flex tw:gap-2">
                            <label className="tw:flex tw:flex-col tw:text-sm">
                                {t('alt', lang)}
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className="tw:border tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm"
                                />
                            </label>
                        </div>

                         {audioUrl && (
                            <div className="tw:mt-2">
                                <p className="tw:text-sm tw:text-gray-600 tw:mb-1">پیش‌نمایش:</p>
                                <audio controls src={audioUrl} className="tw:w-full" />
                            </div>
                        )}

                         <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <button className={`tw:rounded tw:px-4 tw:py-2 tw:text-white ${!audioUrl ? 'tw:bg-blue-300 tw:cursor-not-allowed' : 'tw:bg-blue-500 tw:hover:bg-blue-400'}`} onClick={handleInsertAudioFromUrl} disabled={!audioUrl}>
                                {t('add', lang)}
                            </button>
                            <button className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => setOpenUploadAudio(false)}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
