import { FastifyPluginAsync } from 'fastify';
import { FileService } from '../services/file-service';

const fileRoutes: FastifyPluginAsync = async (fastify) => {
  const fileService = new FileService(fastify);

  // Upload a single file
  fastify.post('/upload', async (request, reply) => {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.code(400).send({ error: 'No file provided' });
      }
      
      const file = await fileService.uploadFile(data);
      
      return reply.code(201).send({
        success: true,
        message: 'File uploaded successfully',
        file
      });
    } catch (error) {
      fastify.log.error('Error uploading file:', error);
      return reply.code(500).send({ 
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Upload multiple files
  fastify.post('/upload/multiple', async (request, reply) => {
    try {
      const uploadedFiles = [];
      const files = request.files();
      
      for await (const data of files) {
        const file = await fileService.uploadFile(data);
        uploadedFiles.push(file);
      }
      
      return reply.code(201).send({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      fastify.log.error('Error uploading multiple files:', error);
      return reply.code(500).send({
        error: 'Failed to upload files',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get all files
  fastify.get('/', async (request, reply) => {
    try {
      const files = await fileService.getAllFiles();
      return reply.send({ files });
    } catch (error) {
      fastify.log.error('Error getting files:', error);
      return reply.code(500).send({ 
        error: 'Failed to get files',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get file by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const file = await fileService.getFileById(id);
      
      if (!file) {
        return reply.code(404).send({ error: 'File not found' });
      }
      
      return reply.send({ file });
    } catch (error) {
      fastify.log.error('Error getting file:', error);
      return reply.code(500).send({ 
        error: 'Failed to get file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete file by ID
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const deleted = await fileService.deleteFile(id);
      
      if (!deleted) {
        return reply.code(404).send({ error: 'File not found or could not be deleted' });
      }
      
      return reply.send({ 
        success: true,
        message: 'File deleted successfully' 
      });
    } catch (error) {
      fastify.log.error('Error deleting file:', error);
      return reply.code(500).send({ 
        error: 'Failed to delete file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default fileRoutes;
