import {useEffect, useState} from 'react';
import {XIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";

export default function UploadModalVideo({ openUploadVideo, setOpenUploadVideo, editor,lang }) {
     const [activeTab, setActiveTab] = useState('upload');
    const [videos, setVideos] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [embedCode, setEmbedCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!openUploadVideo) {
             setVideos([]);
            setUploadProgress(0);
            setIsUploading(false);
            setVideoUrl('');
            setEmbedCode('');
            setErrorMessage('');
            setActiveTab('upload');
        }
    }, [openUploadVideo]);

    if (!openUploadVideo) {
         return null;
    }

    const handleDragOver = (e) => {
         e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
         e.preventDefault();
        e.stopPropagation();
        const droppedFiles = Array.from(e.dataTransfer.files);
         const validVideos = droppedFiles.filter((file) => file.type.startsWith('video/'));
        console.log("Valid video files:", validVideos);
        if (validVideos.length === 0) {
            console.log("No valid video files dropped");
            setErrorMessage('لطفاً فقط فایل‌های ویدئویی را آپلود کنید.');
            return;
        }
        setVideos((prev) => [...prev, ...validVideos]);
        setErrorMessage('');
    };

    const handleFileSelect = (e) => {
        console.log("handleFileSelect event:", e);
        const selectedFiles = Array.from(e.target.files);
        console.log("Selected files:", selectedFiles);
        const validVideos = selectedFiles.filter((file) => file.type.startsWith('video/'));
        console.log("Valid videos from selection:", validVideos);
        if (validVideos.length === 0 && selectedFiles.length > 0) {
            console.log("No valid video files selected");
            setErrorMessage('لطفاً فقط فایل‌های ویدئویی را انتخاب کنید.');
            return;
        }
        setVideos((prev) => [...prev, ...validVideos]);
        setErrorMessage('');
    };

    const handleRemoveVideo = (index) => {
        console.log("Removing video at index:", index);
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        console.log("handleUpload triggered");
        if (!videos.length) {
            console.log("No videos selected for upload");
            setErrorMessage('لطفاً ابتدا یک فایل ویدئویی انتخاب کنید.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setErrorMessage('');

        let fakeProgress = 0;
        const interval = setInterval(() => {
            fakeProgress += 10;
            setUploadProgress(fakeProgress);
            console.log("Upload progress:", fakeProgress);
            if (fakeProgress >= 100) {
                clearInterval(interval);
            }
        }, 500);

        const formData = new FormData();
        videos.forEach((video, idx) => {
            console.log(`Appending video ${idx}:`, video);
            formData.append('videos', video);
        });

        try {
            console.log("Sending upload request to /api/upload-video");
            const res = await fetch('/api/upload-video', {
                method: 'POST',
                body: formData,
            });
            console.log("Upload response received:", res);

            if (res.ok) {
                const data = await res.json();
                console.log("Upload success, server response data:", data);
                if (data?.url) {
                    insertVideoInEditor(data.url);
                } else {
                    console.log("Server response does not contain URL");
                    setErrorMessage('پاسخ سرور فاقد URL است.');
                }
            } else {
                const errorData = await res.json().catch(() => ({ message: 'خطای آپلود' }));
                console.log("Upload error, server responded with error:", errorData);
                setErrorMessage(errorData.message || `خطای سرور: ${res.status}`);
                clearInterval(interval);
                setIsUploading(false);
                return;
            }
        } catch (error) {
            console.error("Fetch error during upload:", error);
            setErrorMessage('خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید.');
            clearInterval(interval);
            setIsUploading(false);
            return;
        }

        setTimeout(() => {
            console.log("Upload completed, closing modal");
            setIsUploading(false);
            setOpenUploadVideo(false);
        }, 1000);
    };

    // تغییر: استفاده از type "video" به جای "videoElement"
    const insertVideoInEditor = (src) => {
        console.log("insertVideoInEditor called with src:", src);
        if (!editor) {
            console.error("Editor instance not available");
            return;
        }
        try {
            const videoSrc = src.trim();
            if (!videoSrc) {
                console.log("Video src is empty after trimming");
                setErrorMessage('آدرس ویدئو معتبر نیست.');
                return;
            }

            // درج نود ویدئو به صورت جداگانه (نه داخل پاراگراف)
            console.log("Using editor.commands.insertContent to insert video");
            editor.commands.insertContent({
                type: 'video', // توجه کنید که نام نود باید با نام تعریف‌شده در extension مطابقت داشته باشد.
                attrs: {
                    src: videoSrc,
                    preload: "none", // این خط باعث می‌شود که مرورگر از بارگذاری خودکار ویدئو صرفنظر کند
                    controls: true,
                    style: 'width:500px; max-width:100%;padding"10px'
                }
            });
            console.log("Video inserted with src:", videoSrc);
        } catch (error) {
            console.error("Error inserting video:", error);
            setErrorMessage('خطا در درج ویدئو در ادیتور: ' + error.message);
        }
    };




    const handleInsertVideoFromUrl = () => {
        console.log("handleInsertVideoFromUrl triggered with videoUrl:", videoUrl);
        if (!videoUrl.trim()) {
            console.log("Video URL is empty");
            setErrorMessage('لطفاً یک آدرس ویدئو وارد کنید.');
            return;
        }
        if (!videoUrl.trim().match(/^https?:\/\//i)) {
            console.log("Video URL does not start with http/https");
            setErrorMessage('لطفاً یک آدرس اینترنتی معتبر وارد کنید.');
            return;
        }
        insertVideoInEditor(videoUrl);
        setOpenUploadVideo(false);
    };

    const handleInsertEmbedCode = () => {
        console.log("handleInsertEmbedCode triggered with embedCode:", embedCode);
        setErrorMessage('');
        if (!embedCode.trim()) {
            console.log("Embed code is empty");
            setErrorMessage('لطفاً کد iframe را وارد کنید.');
            return;
        }
        const iframeRegex = /<iframe\s[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/i;
        const match = embedCode.trim().match(iframeRegex);
        console.log("Result of iframe regex match:", match);
        if (!match) {
            console.log("Embed code did not match the iframe regex");
            setErrorMessage('لطفاً کد iframe معتبر وارد کنید (فقط iframe).');
            return;
        }
        const srcValue = match[1];
        console.log("Extracted src from embed code:", srcValue);
        const isYoutube = srcValue.includes('youtube.com') || srcValue.includes('youtu.be');
        const isAparat = srcValue.includes('aparat.com');
        if (!isYoutube && !isAparat) {
            console.log("Embed code src is not from Youtube or Aparat");
            setErrorMessage('فقط iframe از دامنه‌های youtube.com یا aparat.com مجاز است.');
            return;
        }
        try {
            if (!editor) {
                console.error("Editor instance not available for embed code");
                setErrorMessage('ادیتور در دسترس نیست.');
                return;
            }
            const secureEmbed = embedCode.replace('<iframe', '<iframe loading="lazy" sandbox="allow-scripts allow-same-origin"');
            console.log("Secure embed code to insert:", secureEmbed);
            editor.chain().focus().insertContent(secureEmbed).run();
            console.log("Embed code inserted successfully");
            setOpenUploadVideo(false);
        } catch (error) {
            console.error("Error inserting embed code:", error);
            setErrorMessage('خطا در درج کد embed.');
        }
    };

    return (
        <div
            className="tw:fixed tw:inset-0 tw:z-40 tw:backdrop-blur-xs tw:flex tw:items-center tw:justify-center tw:px-2"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setOpenUploadVideo(false);
                }
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="tw:bg-white tw:dark:bg-gray-600  tw:border tw:border-gray-200 tw:dark:border-gray-700 tw:p-5 tw:w-full tw:max-w-2xl tw:flex tw:flex-col tw:gap-4 tw:md:my-10 tw:rounded-lg tw:shadow-lg tw:relative">
                <div className="tw:flex tw:flex-row tw:justify-between tw:items-center tw:mb-1">
                    <span className="tw:font-bold"> {t('addVideo', lang)}</span>
                    <button onClick={() => {setOpenUploadVideo(false);}} className="cursor-pointer text-gray-700 hover:text-gray-500" aria-label= {t('close', lang)}>
                        <XIcon/>
                    </button>
                </div>
                <div className="tw:flex tw:border-b tw:border-gray-300 tw:dark:border-gray-700 tw:mb-2">
                    <button onClick={() => {setActiveTab('upload');setErrorMessage('');}} className={`tw:py-2 tw:px-4 ${activeTab === 'upload' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}>
                        {t('uploadFile', lang)}
                    </button>
                    <button onClick={() => {setActiveTab('url');setErrorMessage('');}} className={`tw:py-2 tw:px-4 ${activeTab === 'url' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}>
                        {t('directLink', lang)}
                    </button>
                    <button onClick={() => {setActiveTab('embed');setErrorMessage('');}} className={`tw:py-2 tw:px-4 ${activeTab === 'embed' ? 'tw:border-b-2 tw:border-blue-500 tw:text-blue-500' : 'tw:text-gray-600 tw:dark:text-gray-300'}`}>
                        Embed
                    </button>
                </div>
                {errorMessage && (
                    <div className="tw:text-red-600 tw:text-sm tw:p-2 tw:bg-red-50 tw:rounded-md tw:border tw:border-red-200">
                        {errorMessage}
                    </div>
                )}
                {activeTab === 'upload' && (
                    <div>
                        <div
                            className="tw:flex tw:flex-col tw:text-gray-500  tw:justify-center tw:items-center tw:border-2 tw:border-dashed tw:border-gray-400 tw:rounded-xl tw:p-8 tw:dark:bg-gray-700 tw:hover:dark:bg-gray-800 tw:hover:border-gray-700 tw:hover:bg-gray-50 tw:cursor-pointer tw:transition-colors tw:duration-200"
                            onClick={() => {
                                document.getElementById('videoInput').click();
                            }}
                        >
                            <p className="tw:text-center tw:mb-2">
                                {t('dragUpload', lang)}
                            </p>
                            <p className="tw:text-xs tw:text-gray-400"> MP4, WebM, MOV, AVI</p>
                            <input
                                id="videoInput"
                                type="file"
                                multiple
                                accept="video/*"
                                className="tw:hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        {videos.length > 0 && (
                            <div className="tw:mt-4">
                                <p className="tw:text-sm tw:font-semibold tw:mb-2">فایل‌های انتخاب شده:</p>
                                <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                                    {videos.map((file, index) => (
                                        <div key={index} className="tw:relative tw:bg-gray-100 tw:rounded-md tw:p-2 tw:pr-8">
                                            <div className="tw:text-sm tw:truncate tw:max-w-xs">{file.name}</div>
                                            <button
                                                className="tw:absolute tw:top-1 tw:right-1 tw:bg-red-500 tw:hover:bg-red-400 tw:text-white tw:rounded-full tw:w-5 tw:h-5 tw:flex tw:items-center tw:justify-center tw:text-xs tw:cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveVideo(index);
                                                }}
                                                aria-label={t('delete', lang)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {isUploading && (
                            <div className="tw:mt-4">
                                <p className="tw:text-sm tw:mb-1">{t('uploading', lang)} {uploadProgress}%</p>
                                <div className="tw:w-full tw:bg-gray-200 tw:dark:bg-gray-800 tw:rounded-full tw:h-2.5 tw:dark:bg-gray-700">
                                    <div
                                        className="tw:bg-blue-600 tw:h-2.5 tw:rounded-full tw:transition-all tw:duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <button className={`tw:rounded tw:px-4 tw:py-2 tw:text-white ${isUploading || videos.length === 0 ? 'tw:bg-gray-400 tw:cursor-not-allowed' : 'tw:bg-green-500 tw:hover:bg-green-400'}`} onClick={handleUpload} disabled={isUploading || videos.length === 0}>
                                {t('add', lang)}
                            </button>
                            <button className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => {console.log("Cancel button clicked on upload tab");setOpenUploadVideo(false);}} disabled={isUploading}>
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
                                type="url"
                                value={videoUrl}
                                onChange={(e) => {
                                    console.log("Video URL changed to:", e.target.value);
                                    setVideoUrl(e.target.value);
                                }}
                                className="tw:border tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm tw:mt-1 tw:focus:border-blue-500 tw:focus:ring-1 tw:focus:ring-blue-500 tw:outline-none"
                                placeholder="https://server.com/video.mp4"
                            />
                        </label>

                        <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <button className={`tw:rounded tw:px-4 tw:py-2 tw:text-white ${!videoUrl.trim() ? 'tw:bg-gray-400 tw:cursor-not-allowed' : 'tw:bg-blue-500 tw:hover:bg-blue-400'}`} onClick={handleInsertVideoFromUrl} disabled={!videoUrl.trim()}>
                                {t('add', lang)}
                            </button>
                            <button className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => {console.log("Cancel button clicked on URL tab");setOpenUploadVideo(false);}}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
                {activeTab === 'embed' && (
                    <div>
                        <label className="tw:flex tw:flex-col tw:text-sm tw:mb-2">
                            iframe
                            <textarea
                                rows={4}
                                className="tw:border tw:border-gray-400 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm tw:mt-1 tw:focus:border-blue-500 tw:focus:ring-1 tw:focus:ring-blue-500 tw:outline-none"
                                placeholder='<iframe src="https://www.aparat.com/video/..."></iframe>'
                                value={embedCode}
                                onChange={(e) => {
                                    console.log("Embed code changed:", e.target.value);
                                    setEmbedCode(e.target.value);
                                }}
                            />
                        </label>
                        <p className="tw:text-xs tw:text-gray-500 tw:mb-4">
                            {t('embedDesc', lang)}
                        </p>
                        <div className="tw:flex tw:flex-row tw:gap-2 tw:justify-end tw:mt-4">
                            <button className={`tw:rounded tw:px-4 tw:py-2 tw:text-white ${!embedCode.trim() ? 'tw:bg-gray-400 tw:cursor-not-allowed' : 'tw:bg-blue-500 tw:hover:bg-blue-400'}`} onClick={handleInsertEmbedCode} disabled={!embedCode.trim()}>
                                {t('add', lang)}
                            </button>
                            <button className="tw:rounded tw:bg-gray-300 tw:hover:bg-gray-200 tw:px-4 tw:py-2" onClick={() => {setOpenUploadVideo(false);}}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
