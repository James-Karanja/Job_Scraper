import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Ensure root directory is in path so we can import worker
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import worker

@pytest.fixture
def mock_supabase():
    with patch('worker.supabase') as mock:
        yield mock

@pytest.fixture
def mock_subprocess():
    with patch('subprocess.Popen') as mock:
        yield mock

def test_run_job_success(mock_supabase, mock_subprocess):
    # Arrange
    job_request = {'id': 'test-job-123'}
    
    # Mock subprocess behavior
    mock_process = MagicMock()
    mock_process.stdout = ['Log line 1\n', 'Log line 2\n']
    mock_process.wait.return_value = None
    mock_process.returncode = 0
    mock_subprocess.return_value = mock_process

    # Act
    worker.run_job(job_request)

    # Assert
    # 1. Check status update to 'processing'
    mock_supabase.table.return_value.update.assert_any_call({"status": "processing"})
    
    # 2. Check log insertion
    # We expect calls for initial info, the 2 log lines, and success message
    assert mock_supabase.table('logs').insert.call_count >= 4
    
    # 3. Check status update to 'completed'
    mock_supabase.table.return_value.update.assert_any_call({
        "status": "completed", 
        "result_summary": "Workflow completed successfully."
    })

def test_run_job_failure(mock_supabase, mock_subprocess):
    # Arrange
    job_request = {'id': 'test-job-fail'}
    
    # Mock subprocess failure
    mock_process = MagicMock()
    mock_process.stdout = []
    mock_process.wait.return_value = None
    mock_process.returncode = 1
    mock_subprocess.return_value = mock_process

    # Act
    worker.run_job(job_request)

    # Assert
    # Check status update to 'failed'
    mock_supabase.table.return_value.update.assert_any_call({
        "status": "failed", 
        "result_summary": "Process exited with code 1"
    })
