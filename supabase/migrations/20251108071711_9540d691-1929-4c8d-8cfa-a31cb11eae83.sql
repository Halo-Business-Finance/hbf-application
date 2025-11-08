-- Add versioning columns to borrower_documents table
ALTER TABLE public.borrower_documents
ADD COLUMN version_number integer NOT NULL DEFAULT 1,
ADD COLUMN parent_document_id uuid REFERENCES public.borrower_documents(id) ON DELETE CASCADE,
ADD COLUMN is_latest_version boolean NOT NULL DEFAULT true;

-- Create index for faster version lookups
CREATE INDEX idx_borrower_documents_parent_id ON public.borrower_documents(parent_document_id);
CREATE INDEX idx_borrower_documents_latest_version ON public.borrower_documents(is_latest_version) WHERE is_latest_version = true;

-- Function to handle version updates
CREATE OR REPLACE FUNCTION public.update_document_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a new version is inserted with a parent_document_id
  IF NEW.parent_document_id IS NOT NULL AND TG_OP = 'INSERT' THEN
    -- Mark all previous versions as not latest
    UPDATE public.borrower_documents
    SET is_latest_version = false
    WHERE id = NEW.parent_document_id 
       OR parent_document_id = NEW.parent_document_id;
    
    -- Set the new document as latest version
    NEW.is_latest_version := true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically manage version flags
CREATE TRIGGER trigger_update_document_version
BEFORE INSERT ON public.borrower_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_document_version();

-- Add helpful comment
COMMENT ON COLUMN public.borrower_documents.version_number IS 'Version number of the document, starting from 1';
COMMENT ON COLUMN public.borrower_documents.parent_document_id IS 'Reference to the original document ID for versioned documents';
COMMENT ON COLUMN public.borrower_documents.is_latest_version IS 'Flag indicating if this is the latest version of the document';