-- Create documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('borrower-documents', 'borrower-documents', false);

-- Create borrower_documents table
CREATE TABLE public.borrower_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  document_category text NOT NULL DEFAULT 'general',
  description text,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.borrower_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for borrower_documents
CREATE POLICY "Users can view their own documents"
  ON public.borrower_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents"
  ON public.borrower_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON public.borrower_documents
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.borrower_documents
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
  ON public.borrower_documents
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Storage policies for borrower-documents bucket
CREATE POLICY "Users can view their own documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'borrower-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'borrower-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'borrower-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'borrower-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'borrower-documents' AND has_role(auth.uid(), 'admin'::user_role));

-- Trigger for updated_at
CREATE TRIGGER update_borrower_documents_updated_at
  BEFORE UPDATE ON public.borrower_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();