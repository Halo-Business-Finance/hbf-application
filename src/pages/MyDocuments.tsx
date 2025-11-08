import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  ChevronRight,
  Folder,
  FileText,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_category: string;
  description: string | null;
  uploaded_at: string;
}

interface FolderCategory {
  id: string;
  name: string;
  count: number;
}

const MyDocuments = () => {
  const { authenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('business_tax_returns');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const folders: FolderCategory[] = [
    { id: 'business_tax_returns', name: 'Business Tax Returns', count: 0 },
    { id: 'personal_tax_returns', name: 'Personal Tax Returns', count: 0 },
    { id: 'pl_balance_sheet', name: 'P&L and Balance Sheet', count: 0 },
    { id: 'bank_statements', name: 'Bank Statements', count: 0 },
    { id: 'debt_schedule', name: 'Debt Schedule and Notes', count: 0 },
    { id: 'loan_app_license', name: "Loan Application & Driver's License", count: 0 },
    { id: 'ar_ap', name: 'AR & AP', count: 0 },
    { id: 'projections_resume', name: 'Projections, Resume & Business Plan', count: 0 },
    { id: 'sba_bank_docs', name: 'SBA & Bank Documents', count: 0 },
    { id: 'corp_articles', name: 'Corp Articles, Operating Agreement & EIN Form', count: 0 },
    { id: 'miscellaneous', name: 'Miscellaneous', count: 0 },
  ];

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/');
      return;
    }

    if (authenticated && user) {
      loadDocuments();
    }
  }, [authenticated, loading, navigate, user]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('borrower_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const validateFileType = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    };

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = Object.keys(allowedTypes).includes(file.type);
    const isValidExtension = Object.values(allowedTypes).flat().includes(fileExtension);

    if (!isValidType && !isValidExtension) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload PDF, Word, Excel, or image files (JPG, PNG).'
      };
    }

    return { valid: true };
  };

  const processFiles = (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    const validFiles: File[] = [];
    
    for (const file of filesArray) {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        continue;
      }

      // Validate file type
      const validation = validateFileType(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file type",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive"
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      return true;
    }
    return false;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const totalFiles = selectedFiles.length;
      let uploadedCount = 0;
      let failedCount = 0;

      for (const file of selectedFiles) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_${file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('borrower-documents')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase
            .from('borrower_documents')
            .insert({
              user_id: user.id,
              file_name: file.name,
              file_path: fileName,
              file_type: file.type,
              file_size: file.size,
              document_category: selectedCategory,
              description: null
            });

          if (dbError) throw dbError;

          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          failedCount++;
        }
      }

      if (uploadedCount > 0) {
        toast({
          title: "Success",
          description: `${uploadedCount} document${uploadedCount > 1 ? 's' : ''} uploaded successfully${failedCount > 0 ? `, ${failedCount} failed` : ''}`
        });
      }

      if (failedCount > 0 && uploadedCount === 0) {
        toast({
          title: "Error",
          description: "Failed to upload documents",
          variant: "destructive"
        });
      }

      setTimeout(() => {
        setSelectedFiles([]);
        setUploadDialogOpen(false);
        setUploadProgress(0);
        loadDocuments();
      }, 500);
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Error",
        description: "Failed to upload documents",
        variant: "destructive"
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const getDocumentCountByCategory = (categoryId: string) => {
    return documents.filter(doc => doc.document_category === categoryId).length;
  };

  const getDocumentsByCategory = (categoryId: string) => {
    return documents.filter(doc => doc.document_category === categoryId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handlePreviewClick = async (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewDocument(doc);
    setPreviewDialogOpen(true);
    setLoadingPreview(true);

    try {
      const { data, error } = await supabase.storage
        .from('borrower-documents')
        .createSignedUrl(doc.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      setPreviewUrl(data.signedUrl);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast({
        title: "Error",
        description: "Failed to load document preview",
        variant: "destructive"
      });
      setPreviewDialogOpen(false);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDeleteClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
    setPreviewDocument(null);
    setPreviewUrl(null);
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isPdfFile = (fileType: string) => {
    return fileType === 'application/pdf';
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setDeleting(true);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('borrower-documents')
        .remove([documentToDelete.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('borrower_documents')
        .delete()
        .eq('id', documentToDelete.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-foreground" />
            <h1 className="text-xl font-bold">Secured Document Storage</h1>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)} className="flex items-center gap-2 h-9 text-sm">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>

        {/* Folders List */}
        <div className="bg-white rounded-lg border">
          {folders.map((folder) => {
            const count = getDocumentCountByCategory(folder.id);
            const isExpanded = expandedFolder === folder.id;
            const categoryDocs = getDocumentsByCategory(folder.id);

            return (
              <div key={folder.id}>
                <div
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-all duration-200"
                  onClick={() => setExpandedFolder(isExpanded ? null : folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                    <Folder className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{count}</span>
                </div>

                {/* Expanded folder content */}
                {isExpanded && categoryDocs.length > 0 && (
                  <div className="bg-gray-50 px-3 py-2 border-b">
                    {categoryDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 py-2 px-6 hover:bg-white rounded transition-colors duration-200 group"
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="flex-1 text-sm">{doc.file_name}</span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.file_size)}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(isImageFile(doc.file_type) || isPdfFile(doc.file_type)) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handlePreviewClick(doc, e)}
                            >
                              <Eye className="w-4 h-4 text-primary" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleDeleteClick(doc, e)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Select a category and upload your document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Document Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <Input
                  id="file"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? 'Drop files here' : 'Drag & drop your files here'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse (multiple files supported)
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: PDF, Word, Excel, JPG, PNG (Max 10MB each)
                  </p>
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center gap-2 p-3 bg-muted rounded-lg group">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full"
            >
              {uploading ? `Uploading... ${uploadProgress}%` : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} Document${selectedFiles.length > 1 ? 's' : ''}` : 'Documents'}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{previewDocument?.file_name}</DialogTitle>
                <DialogDescription className="text-xs mt-1">
                  {previewDocument && formatFileSize(previewDocument.file_size)}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClosePreview}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto bg-muted/30 p-4">
            {loadingPreview ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading preview...</p>
                </div>
              </div>
            ) : previewUrl && previewDocument ? (
              <>
                {isImageFile(previewDocument.file_type) && (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={previewUrl}
                      alt={previewDocument.file_name}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                {isPdfFile(previewDocument.file_type) && (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full rounded-lg border-0"
                    title={previewDocument.file_name}
                  />
                )}

                {!isImageFile(previewDocument.file_type) && !isPdfFile(previewDocument.file_type) && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Preview not available for this file type
                      </p>
                      <Button asChild>
                        <a href={previewUrl} download={previewDocument.file_name}>
                          Download File
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.file_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyDocuments;
