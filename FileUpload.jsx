import React, { useRef, useState } from 'react';
import { Upload, X, File, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

/**
 * FILE UPLOAD COMPONENT
 * Upload de fichiers avec drag & drop
 */
export default function FileUpload({
  onUploadComplete,
  accept = '*',
  maxSize = 10, // MB
  multiple = false,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max ${maxSize}MB)`);
        return false;
      }
      return true;
    });

    setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      
      const results = await Promise.all(uploadPromises);
      onUploadComplete?.(results.map(r => r.file_url));
      
      toast.success(`${files.length} fichier(s) uploadé(s)`);
      setFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-[var(--nea-primary-blue)] bg-blue-500/10"
            : "border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] hover:bg-[var(--nea-bg-surface-hover)]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--nea-text-muted)]" />
        <p className="text-[var(--nea-text-primary)] font-medium mb-1">
          Glissez vos fichiers ici
        </p>
        <p className="text-sm text-[var(--nea-text-secondary)]">
          ou cliquez pour sélectionner (max {maxSize}MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-5 h-5 text-[var(--nea-primary-blue)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--nea-text-primary)] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--nea-text-secondary)]">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
                disabled={uploading}
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}

          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-[var(--nea-primary-blue)] hover:bg-blue-600"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Uploader {files.length} fichier(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}