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
  Trash2
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('business_tax_returns');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('borrower-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('borrower_documents')
        .insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_path: fileName,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          document_category: selectedCategory,
          description: null
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });

      setSelectedFile(null);
      setUploadDialogOpen(false);
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
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

  const handleDeleteClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteClick(doc, e)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
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
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
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
