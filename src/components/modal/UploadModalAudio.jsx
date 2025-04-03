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
            className="fixed inset-0 z-40 backdrop-blur-xs flex items-center justify-center px-2"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setOpenUploadAudio(false)
                }
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="bg-white border border-gray-200 p-5 w-full max-w-2xl flex flex-col gap-4 md:my-10 rounded relative" onClick={(e) => e.stopPropagation()}>
                {/* هدر مودال */}
                <div className="flex flex-row justify-between items-center">
                    <span className="font-bold"> {t('addAudio', lang)}</span>
                    <span
                        onClick={() => setOpenUploadAudio(false)}
                        className="cursor-pointer text-gray-700 hover:text-gray-500"
                    >
                        <XIcon/>
                    </span>
                </div>

                {/* تب‌ها */}
                <div className="flex border-b border-gray-300 mb-2">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                    >
                        {t('uploadFile', lang)}
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`py-2 px-4 ${activeTab === 'url' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                    >
                        {t('directLink', lang)}
                    </button>
                </div>

                {/* محتوای تب‌ها */}
                {activeTab === 'upload' && (
                    <div>
                        {/* ناحیه درگ‌ودراپ */}
                        <div className="flex flex-col text-gray-500 justify-center items-center border-2 border-dashed border-gray-500 rounded-xl h-30 hover:border-gray-700 hover:bg-gray-200 cursor-pointer p-5" onClick={() => document.getElementById('audioFileInput').click()}>
                            {t('dragUpload', lang)}
                            <input
                                id="audioFileInput"
                                type="file"
                                accept="audio/*"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* پیش‌نمایش فایل‌های صوتی انتخاب شده */}
                        {audios.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {audios.map((file, index) => (
                                    <div key={index} className="relative">
                                        <audio controls src={URL.createObjectURL(file)} className="w-60" />
                                        <button
                                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full p-1 text-xs cursor-pointer"
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
                            <div className="w-full bg-gray-200 rounded h-4 mt-2">
                                <div
                                    className="bg-blue-500 h-4 rounded transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}

                        <div className="flex gap-2 mt-4">
                            <label className="flex flex-col text-sm">
                                توضیحات:
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                />
                            </label>
                            <label className="flex flex-col text-sm">
                                عرض (پیکسل):
                                <input
                                    type="number"
                                    min="100"
                                    max="1000"
                                    value={audioWidth}
                                    onChange={(e) => setAudioWidth(e.target.value)}
                                    className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                />
                            </label>
                        </div>

                        {/* دکمه‌های آپلود و بستن */}
                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className={`rounded px-4 py-2 text-white ${isUploading || !audios.length ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`} onClick={handleUpload} disabled={isUploading || !audios.length}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => setOpenUploadAudio(false)} disabled={isUploading}>
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
                                value={audioUrl}
                                onChange={(e) => setAudioUrl(e.target.value)}
                                className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                placeholder= {t('addAddressFile', lang)}
                            />
                        </label>

                        <div className="flex gap-2">
                            <label className="flex flex-col text-sm">
                                توضیحات:
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                />
                            </label>
                            <label className="flex flex-col text-sm">
                                عرض (پیکسل):
                                <input
                                    type="number"
                                    min="100"
                                    max="1000"
                                    value={audioWidth}
                                    onChange={(e) => setAudioWidth(e.target.value)}
                                    className="border border-gray-400 rounded px-2 py-1.5 text-sm"
                                />
                            </label>
                        </div>

                        {/* پیش‌نمایش لینک صدا */}
                        {audioUrl && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-1">پیش‌نمایش:</p>
                                <audio controls src={audioUrl} className="w-full" />
                            </div>
                        )}

                        {/* دکمه درج در ادیتور */}
                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className={`rounded px-4 py-2 text-white ${!audioUrl ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'}`} onClick={handleInsertAudioFromUrl} disabled={!audioUrl}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => setOpenUploadAudio(false)}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
