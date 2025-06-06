import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Search, Filter, MoreHorizontal, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';
import { useCampaignStore } from '@/api/store/campaignStore/campaign'; // Import campaign store
import { nanoid } from 'nanoid'; // For generating unique IDs
import { getMappingSuggestions, processLeadsWithMapping } from '@/api/leads';

// Update the Lead interface to include more fields
interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    headline?: string;
    jobTitle?: string;
    company?: string;
    location?: string;
    email?: string;
    avatar: string;
    selected: boolean;
    linkedinUrl?: string; // Add LinkedIn URL field
}

interface UploadedFile {
    name: string;
    size: string;
    processed: boolean;
    fileObject?: File;
}

interface ColumnMapping {
    columnName: string;
    type: string;
    samples: string[];
}

interface ListOfLeadsProps {
    leadData?: any;
    updateLeads: (leads: any) => void;
}

const ListOfLeads = ({ leadData, updateLeads }: ListOfLeadsProps) => {
    const { toast } = useToast();
    // Add these state variables near your other useState declarations
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // Use campaign store
    const { setLeadsFile, setLeadsData } = useCampaignStore();
    // Get store data to check if leads already exist
    const storeLeads = useCampaignStore(state => state.campaign.leads);
    console.log('Current leads in store:', storeLeads);
    const [showLeadsGrid, setShowLeadsGrid] = useState(false);
    const [selectedList, setSelectedList] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [showColumnMapping, setShowColumnMapping] = useState(false);
    const [validationComplete, setValidationComplete] = useState(false);
    const [validRowsCount, setValidRowsCount] = useState(0);
    const [parsedCsvData, setParsedCsvData] = useState<any[]>([]);
    const [verifySettings, setVerifySettings] = useState({
        checkDuplicates: {
            campaigns: true,
            lists: true,
            workspace: true
        },
        verifyLeads: false
    });

    // Column mappings in exact sequence requested
    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([{
        columnName: 'First Name',
        type: 'first-name',
        samples: ['John', 'Sarah', 'Michael', 'Emma']
    }, {
        columnName: 'Last Name',
        type: 'last-name',
        samples: ['Doe', 'Smith', 'Johnson', 'Wilson']
    }, {
        columnName: 'LinkedIn URL',
        type: 'linkedin-url',
        samples: ['linkedin.com/in/johndoe', 'linkedin.com/in/sarahsmith', 'linkedin.com/in/michaelj', 'linkedin.com/in/emmaw']
    }, {
        columnName: 'Headline',
        type: 'headline',
        samples: ['Senior Developer at TechCorp', 'Marketing Manager', 'Product Designer', 'Sales Director']
    }, {
        columnName: 'Job Title',
        type: 'job-title',
        samples: ['Senior Software Engineer', 'Marketing Manager', 'Product Designer', 'Sales Director']
    }, {
        columnName: 'Location',
        type: 'location',
        samples: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA']
    }, {
        columnName: 'Company',
        type: 'company',
        samples: ['TechCorp', 'StartupInc', 'MegaCorp', 'BusinessCo']
    }, {
        columnName: 'Email',
        type: 'email',
        samples: ['john@company.com', 'sarah@startup.io', 'michael@corp.net', 'emma@business.co']
    }, {
        columnName: 'Tags',
        type: 'tags',
        samples: ['VIP', 'Hot Lead', 'Enterprise', 'SMB']
    }]);

    // Initialize with default leads
    const [leads, setLeads] = useState<Lead[]>([{
        id: '1',
        firstName: 'CA',
        lastName: 'MadhuKumar',
        location: 'Mumbai, Maharashtra, India',
        jobTitle: 'Chartered Accountant',
        email: 'madhu@example.com',
        avatar: '/placeholder.svg',
        selected: false
    }, {
        id: '2',
        firstName: 'Ankit',
        lastName: 'Mehta',
        location: 'Mumbai, Maharashtra, India',
        jobTitle: 'Partner at S.M.P. O...',
        email: 'ankit@example.com',
        avatar: '/placeholder.svg',
        selected: false
    }, {
        id: '3',
        firstName: 'Ravi',
        lastName: 'Garg',
        location: 'Bangalore, Karnataka, India',
        jobTitle: 'Founder',
        email: 'ravi@example.com',
        avatar: '/placeholder.svg',
        selected: false
    }, {
        id: '4',
        firstName: 'Hiral',
        lastName: 'Bhojani',
        location: 'Rajkot, Gujarat, India',
        jobTitle: 'Human Resources',
        email: 'hiral@example.com',
        avatar: '/placeholder.svg',
        selected: false
    }, {
        id: '5',
        firstName: 'Trusha',
        lastName: 'Khatate',
        location: 'Mumbai, Maharashtra, India',
        jobTitle: 'Founder at Business',
        email: 'trusha@example.com',
        avatar: '/placeholder.svg',
        selected: false
    }, {
        id: '6',
        firstName: 'Vikas',
        lastName: 'Tandon',
        location: 'Mumbai, Maharashtra, India',
        jobTitle: 'Musician | Founder',
        email: 'vikas@example.com',
        avatar: '/placeholder.svg',
        selected: false
    }]);

    // Updated type options with exact sequence and emojis
    const typeOptions = [{
        value: 'first-name',
        label: '🧑 First Name',
        icon: '🧑'
    }, {
        value: 'last-name',
        label: '👤 Last Name',
        icon: '👤'
    }, {
        value: 'linkedin-url',
        label: '🔗 LinkedIn URL',
        icon: '🔗'
    }, {
        value: 'headline',
        label: '📝 Headline',
        icon: '📝'
    }, {
        value: 'job-title',
        label: '💼 Job Title',
        icon: '💼'
    }, {
        value: 'location',
        label: '📍 Location',
        icon: '📍'
    }, {
        value: 'company',
        label: '🏢 Company',
        icon: '🏢'
    }, {
        value: 'email',
        label: '✉️ Email',
        icon: '✉️'
    }, {
        value: 'tags',
        label: '🏷️ Tags',
        icon: '🏷️'
    }, {
        value: 'custom-variable',
        label: '⚙️ Custom Variable',
        icon: '⚙️'
    }, {
        value: 'do-not-import',
        label: '❌ Do Not Import',
        icon: '❌'
    }];

    // Parse CSV file and update column mappings
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        // Store the file reference
        setUploadedFile({
            name: file.name,
            size: `${formatFileSize(file.size)}`,
            processed: false,
            fileObject: file
        });
        
        // Also store in campaign store
        setLeadsFile(file);
        
        try {
            // Set loading state
            setIsLoading(true);
            
            // Send the raw file to backend for mapping suggestions
            const response = await getMappingSuggestions(file);
            const suggestedMappings = response.data.mappings;
            const parsedData = response.data.previewData || [];
            
            // Start local parsing for preview if backend didn't provide preview data
            if (!parsedData.length) {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    preview: 5, // Just parse a few rows for preview
                    complete: (results) => {
                        setParsedCsvData(results.data as any[]);
                    }
                });
            } else {
                // Use backend-provided preview data
                setParsedCsvData(parsedData);
            }
            
            // Update column mappings with backend suggestions if available
            if (suggestedMappings && suggestedMappings.length > 0) {
                setColumnMappings(suggestedMappings.map((mapping: any) => ({
                    columnName: mapping.columnName,
                    type: mapping.mappedType,
                    samples: mapping.samples || []
                })));
            } else {
                // Fall back to client-side mapping logic
                handleClientSideMapping(file);
            }
            
            setValidRowsCount(response.data.totalRows || parsedData.length);
            setUploadedFile(prev => prev ? {...prev, processed: true} : null);
            setShowColumnMapping(true);
            setValidationComplete(true);
            
        } catch (error) {
            console.error('Error getting mapping suggestions:', error);
            
            // Fall back to client-side mapping on error
            handleClientSideMapping(file);
            
            toast({
              variant: "warning",
              title: "Using local mapping",
              description: "Couldn't get mapping suggestions from server. Using local parsing instead."
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Add this fallback function for client-side mapping
    const handleClientSideMapping = (file: File) => {
        // This contains your existing CSV parsing logic from the current handleFileUpload
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data as any[];
                setParsedCsvData(parsedData);
                
                if (results.meta.fields && results.meta.fields.length > 0) {
                    // Generate column mappings based on headers (your existing logic)
                    const newColumnMappings: ColumnMapping[] = results.meta.fields.map(header => {
                        // Your existing header matching logic
                        let type = 'do-not-import';
                        const headerLower = header.toLowerCase();
                        if (headerLower.includes('first') || headerLower.includes('fname')) {
                            type = 'first-name';
                        } else if (headerLower.includes('last') || headerLower.includes('lname')) {
                            type = 'last-name';
                        } else if (headerLower.includes('linkedin') || headerLower.includes('url') || headerLower.includes('link')) {
                            type = 'linkedin-url';
                        } else if (headerLower.includes('headline')) {
                            type = 'headline';
                        } else if (headerLower.includes('title') || headerLower.includes('role') || headerLower.includes('position')) {
                            type = 'job-title';
                        } else if (headerLower.includes('location') || headerLower.includes('city') || headerLower.includes('country')) {
                            type = 'location';
                        } else if (headerLower.includes('company') || headerLower.includes('employer') || headerLower.includes('organization')) {
                            type = 'company';
                        } else if (headerLower.includes('email')) {
                            type = 'email';
                        } else if (headerLower.includes('tag')) {
                            type = 'tags';
                        }

                        // Get sample data for this column
                        const samples = parsedData.slice(0, 4).map(row => row[header] || '').filter(Boolean);

                        return {
                            columnName: header,
                            type,
                            samples
                        };
                    });
                    
                    // Check if tags field exists in the mappings
                    const hasTagsField = newColumnMappings.some(col => col.type === 'tags');

                    // If not, add a default tags field
                    if (!hasTagsField) {
                        newColumnMappings.push({
                            columnName: 'Tags (Not in CSV)',
                            type: 'tags',
                            samples: ['Add tags manually']
                        });
                    }

                    setColumnMappings(newColumnMappings);
                    setValidRowsCount(parsedData.length);
                }
                
                setUploadedFile(prev => prev ? {...prev, processed: true} : null);
                setShowColumnMapping(true);
                setValidationComplete(true);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                toast({
                    variant: "destructive",
                    title: "Error parsing CSV",
                    description: error.message,
                });
                setUploadedFile(null);
            }
        });
    };

    // Helper function to format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleChooseAnotherMethod = () => {
        setShowColumnMapping(false);
        setUploadedFile(null);
        setValidationComplete(false);
    };

    const handleColumnTypeChange = (columnIndex: number, newType: string) => {
        setColumnMappings(prev => prev.map((col, index) => index === columnIndex ? {
            ...col,
            type: newType
        } : col));
    };

    const handleVerifyLeads = () => {
        setValidationComplete(true);
        toast({
            title: "Leads Verified",
            description: `${validRowsCount} valid leads detected.`,
        });
    };

    // Process the data according to column mappings and update the store
    const handleUploadAll = async () => {
        if (!parsedCsvData.length || !columnMappings.length) {
            toast({
                variant: "destructive",
                title: "No data to process",
                description: "Please upload a valid CSV file first.",
            });
            return;
        }

        try {
            // Set processing state
            setIsProcessing(true);
            
            // Create a mapping object to send back to backend
            const mappingInfo = {
                columnMappings: columnMappings.map(col => ({
                    columnName: col.columnName,
                    mappedType: col.type
                })),
                fileName: uploadedFile?.name
            };
            
            // Send the file with final mappings to backend for processing
            const response = await processLeadsWithMapping(uploadedFile?.fileObject as File, mappingInfo);
            

            console.log('Backend response:', response.data.leadListId);

            const leadListId = response.data.leadListId;
            // Get processed lead data from backend
            const processedData = response.data.processedLeads || [];
            
            // If backend processing failed, fall back to client-side processing
            if (!processedData.length) {
                console.log("Falling back to client-side processing");
                return handleClientSideProcessing();
            }
            
            // Convert processed data to Lead format for display
            const formattedLeads: Lead[] = processedData.map((item: any) => ({
                id: item.id || `imported-${nanoid()}`,
                firstName: item.firstName || 'Unknown',
                lastName: item.lastName || 'User',
                headline: item.headline,
                jobTitle: item.jobTitle,
                company: item.company,
                location: item.location,
                email: item.email,
                avatar: '/placeholder.svg',
                selected: false,
                linkedinUrl: item.linkedinUrl,
            }));

            // Update the local leads state
            setLeads(formattedLeads);
            
            // Create leads data object for store
            const leadsData = {
              file: uploadedFile?.fileObject || null,
              fileName: uploadedFile?.name,
              data: processedData,
              rowCount: processedData.length,
              s3Url: response.data.s3Url || null,
              uploadedAt: new Date().toISOString(),
              leadListId: response.data.leadListId
            };
            
            // Update parent and store
            if (updateLeads) {
              updateLeads(leadsData);
            }
            setLeadsData(leadsData);
            
            toast({
              title: "Leads Successfully Imported",
              description: `${processedData.length} leads are ready for your campaign.`,
            });
            
            setShowLeadsGrid(true);
            setShowColumnMapping(false);
            
        } catch (error) {
            console.error('Error processing CSV data:', error);
            toast({
                variant: "destructive",
                title: "Error processing data",
                description: error instanceof Error ? error.message : "An unknown error occurred",
            });
            
            // Fall back to client-side processing if backend fails
            handleClientSideProcessing();
        } finally {
            setIsProcessing(false);
        }
    };

    // Add this fallback function for client-side processing
    const handleClientSideProcessing = () => {
        // This contains your existing processing logic from the current handleUploadAll
        
        // Create a mapping from column names to their types
        const typeMapping = columnMappings.reduce((acc: Record<string, string>, col) => {
            acc[col.columnName] = col.type;
            return acc;
        }, {});
        
        // Transform the parsed data according to the mappings
        const processedData = parsedCsvData.map((row, index) => {
            // Your existing row processing logic
            const processedRow: Record<string, any> = {
                id: `imported-${nanoid()}`,
            };

            // Process each field according to its mapped type
            Object.keys(row).forEach(key => {
                const type = typeMapping[key];
                if (type && type !== 'do-not-import') {
                    switch (type) {
                        case 'first-name':
                            processedRow.firstName = row[key];
                            break;
                        case 'last-name':
                            processedRow.lastName = row[key];
                            break;
                        case 'linkedin-url':
                            processedRow.linkedinUrl = row[key];
                            break;
                        case 'job-title':
                            processedRow.jobTitle = row[key];
                            break;
                        case 'company':
                            processedRow.company = row[key];
                            break;
                        case 'location':
                            processedRow.location = row[key];
                            break;
                        case 'email':
                            processedRow.email = row[key];
                            break;
                        case 'headline':
                            processedRow.headline = row[key];
                            break;
                        case 'tags':
                            processedRow.tags = row[key];
                            break;
                        default:
                            // For custom variables or unrecognized types
                            processedRow[key] = row[key];
                    }
                }
            });

            // Make sure we always have first and last name fields
            if (!processedRow.firstName) processedRow.firstName = 'Unknown';
            if (!processedRow.lastName) processedRow.lastName = 'User';

            // Add default avatar
            processedRow.avatar = '/placeholder.svg';

            // Initialize selected to false
            processedRow.selected = false;

            return processedRow;
        });

        // Convert processed data to Lead format
        const formattedLeads: Lead[] = processedData.map(item => ({
            id: item.id,
            firstName: item.firstName || 'Unknown',
            lastName: item.lastName || 'User',
            headline: item.headline,
            jobTitle: item.jobTitle,
            company: item.company,
            location: item.location,
            email: item.email,
            avatar: '/placeholder.svg',
            selected: false,
            linkedinUrl: item.linkedinUrl,
        }));

        // Update the local leads state with the processed data
        setLeads(formattedLeads);

        // Create a processed data object to update both the parent and the store
        const leadsData = {
            file: uploadedFile?.fileObject || null,  // Use the stored file reference
            fileName: uploadedFile?.name,
            data: processedData,
            rowCount: processedData.length,
            s3Url: null,
            uploadedAt: new Date().toISOString()
        };

        console.log("Uploading leads with file reference:", leadsData.file ? "File present" : "File missing");

        // Update the parent component with the processed data (for backward compatibility)
        if (updateLeads) {
            updateLeads(leadsData);
        }

        // Update the campaign store with the leads data
        setLeadsData(leadsData);

        // Show success and transition to the grid view
        toast({
            title: "Leads Successfully Imported",
            description: `${processedData.length} leads are ready for your campaign.`,
        });

        setShowLeadsGrid(true);
        setShowColumnMapping(false);

        console.log('Leads data processed and saved to campaign store', leadsData);
    };

    const handleImportList = () => {
        if (selectedList) {
            // Create a leads data object
            const leadsData = {
                fileName: selectedList,
                data: leads,
                rowCount: leads.length,
                s3Url: null,
                uploadedAt: new Date().toISOString()
            };

            // Update parent (for backward compatibility)
            if (updateLeads) {
                updateLeads(leadsData);
            }

            // Update the campaign store with the imported list
            setLeadsData(leadsData);

            toast({
                title: "List Imported",
                description: `${leads.length} leads imported from ${selectedList}.`,
            });

            setShowLeadsGrid(true);

            console.log('List imported and saved to campaign store', leadsData);
        }
    };

    const handleLeadSelect = (leadId: string, checked: boolean) => {
        setLeads(leads.map(lead => lead.id === leadId ? {
            ...lead,
            selected: checked
        } : lead));
    };

    const handleSelectAll = (checked: boolean) => {
        setLeads(leads.map(lead => ({
            ...lead,
            selected: checked
        })));
    };

    const selectedCount = leads.filter(lead => lead.selected).length;
    const totalCount = leads.length;
    const allSelected = selectedCount === totalCount && totalCount > 0;

    // Download sample CSV template
    const handleDownloadSample = () => {
        const sampleData = [
            { firstName: 'John', lastName: 'Doe', linkedinUrl: 'https://linkedin.com/in/johndoe', email: 'john@example.com', company: 'Acme Inc.', position: 'CEO' },
            { firstName: 'Jane', lastName: 'Smith', linkedinUrl: 'https://linkedin.com/in/janesmith', email: 'jane@example.com', company: 'Tech Corp', position: 'CTO' },
        ];

        const csv = Papa.unparse(sampleData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'leads_template.csv';
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Check for existing leads in the store when component mounts
    useEffect(() => {
        // If we have leads data in the store, use it and show the grid
        if (storeLeads && (storeLeads.campaign.leads.data || []).length > 0) {
            console.log('Found existing leads in store:', storeLeads);

            // Convert store leads to the format needed by the component
            const formattedLeads: Lead[] = (storeLeads.campaign.leads.data || []).map((item: any) => ({
                id: item.id || `store-${nanoid()}`,
                firstName: item.firstName || 'Unknown',
                lastName: item.lastName || 'User',
                headline: item.headline,
                jobTitle: item.jobTitle,
                company: item.company,
                location: item.location,
                email: item.email,
                avatar: '/placeholder.svg',
                selected: false,
                linkedinUrl: item.linkedinUrl,
            }));

            //   // Update file info if available
            //   if (storeLeads.campaign.leads.fileName) {
            //     setUploadedFile({
            //       name: storeLeads.campaign.leads.fileName,
            //       size: `${(storeLeads.campaign.leads.data || []).length} leads`,
            //       processed: true,
            //       // fileObject will be null since we don't have the actual file object
            //     });
            //   }


            // Update the local leads state
            setLeads(formattedLeads);
            setValidRowsCount(formattedLeads.length);

            // Show the leads grid view
            setShowLeadsGrid(true);
        }
    }, [storeLeads]);

    // Column mapping view
    if (showColumnMapping && uploadedFile) {
        return <div className="space-y-6">
            {/* File Upload Success */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                        <h3 className="font-medium text-gray-900">{uploadedFile.name}</h3>
                        <p className="text-sm text-gray-500">{uploadedFile.size} • File processed</p>
                    </div>
                </div>
            </div>

            {/* Choose Another Method Button - Moved to left */}
            <div className="flex justify-start">
                <button onClick={handleChooseAnotherMethod} className="flex items-center justify-start space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Choose another method</span>
                </button>
            </div>

            {/* Column Mapping Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Map CSV Columns</h2>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Column Name</TableHead>
                                <TableHead>Select Type</TableHead>
                                <TableHead>Sample Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {columnMappings.map((column, index) => <TableRow key={index}>
                                <TableCell className="font-medium">{column.columnName}</TableCell>
                                <TableCell>
                                    <Select value={column.type} onValueChange={value => handleColumnTypeChange(index, value)}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                                            {typeOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        {column.samples.slice(0, 3).map((sample, sampleIndex) => <div key={sampleIndex} className={`text-xs px-2 py-1 rounded ${column.type === 'email' ? 'bg-blue-50 text-blue-700' : column.type === 'location' ? 'bg-green-50 text-green-700' : column.type === 'linkedin-url' ? 'bg-purple-50 text-purple-700' : column.type === 'company' ? 'bg-orange-50 text-orange-700' : column.type === 'job-title' ? 'bg-indigo-50 text-indigo-700' : column.type === 'headline' ? 'bg-pink-50 text-pink-700' : column.type === 'tags' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'}`}>
                                            {sample}
                                        </div>)}
                                    </div>
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </div>

                {/* Verification Controls */}
                <div className="mt-8 space-y-6">
                    {/* Check for duplicates section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-sm font-medium text-gray-900">Check for duplicates across all</span>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={verifySettings.checkDuplicates.campaigns} onCheckedChange={checked => setVerifySettings(prev => ({
                                        ...prev,
                                        checkDuplicates: {
                                            ...prev.checkDuplicates,
                                            campaigns: checked as boolean
                                        }
                                    }))} />
                                    <span className="text-sm text-gray-700">Campaigns</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={verifySettings.checkDuplicates.lists} onCheckedChange={checked => setVerifySettings(prev => ({
                                        ...prev,
                                        checkDuplicates: {
                                            ...prev.checkDuplicates,
                                            lists: checked as boolean
                                        }
                                    }))} />
                                    <span className="text-sm text-gray-700">Lists</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={verifySettings.checkDuplicates.workspace} onCheckedChange={checked => setVerifySettings(prev => ({
                                        ...prev,
                                        checkDuplicates: {
                                            ...prev.checkDuplicates,
                                            workspace: checked as boolean
                                        }
                                    }))} />
                                    <span className="text-sm text-gray-700">The Workspace</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verify leads section */}
                    <div className="flex items-center space-x-3 mb-6">
                        <Checkbox checked={verifySettings.verifyLeads} onCheckedChange={checked => setVerifySettings(prev => ({
                            ...prev,
                            verifyLeads: checked as boolean
                        }))} />
                        <span className="text-sm font-medium text-gray-900">Verify leads</span>
                        <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">⚡ 0.25 / Row</span>
                    </div>

                    {/* Results and Upload */}
                    <div className="flex flex-col items-center space-y-4">
                      {isLoading && <div className="flex items-center space-x-2 text-blue-600">
                        <span className="loading loading-spinner"></span>
                        <span className="text-sm font-medium">Processing CSV data...</span>
                      </div>}
                      
                      {validationComplete && <div className="flex items-center space-x-2 text-green-600 mb-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Detected {validRowsCount} data rows</span>
                      </div>}
                      
                      <Button 
                        onClick={handleUploadAll} 
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-base font-medium rounded-lg"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <span className="loading loading-spinner loading-xs"></span>
                            <span>PROCESSING...</span>
                          </div>
                        ) : 'UPLOAD ALL'}
                      </Button>
                    </div>
                </div>
            </div>
        </div>;
    }

    // Leads grid view
    if (showLeadsGrid) {
        return <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Search leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                        </div>

                        <Select>
                            <SelectTrigger className="w-32">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="founder">Founder</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="director">Director</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mumbai">Mumbai</SelectItem>
                                <SelectItem value="bangalore">Bangalore</SelectItem>
                                <SelectItem value="delhi">Delhi</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-28">
                                <SelectValue placeholder="Tags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem value="warm">Warm</SelectItem>
                                <SelectItem value="cold">Cold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                            <span className="text-sm text-gray-600">Select All</span>
                        </div>

                        {selectedCount > 0 && <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">Remove Selected</Button>
                            <Button variant="outline" size="sm">Edit Tags</Button>
                            <Button variant="outline" size="sm">Export</Button>
                            <Button variant="outline" size="sm">Reassign to Sequence</Button>
                        </div>}
                    </div>
                </div>
            </div>

            {/* Leads Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.map(lead =>
                        <div key={lead.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${lead.selected ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                            <div className="flex items-start space-x-3">
                                <Checkbox checked={lead.selected} onCheckedChange={checked => handleLeadSelect(lead.id, checked as boolean)} />
                                <img src={lead.avatar} alt={`${lead.firstName} ${lead.lastName}`} className="w-10 h-10 rounded-full bg-gray-200" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                        {lead.firstName} {lead.lastName}
                                    </h3>

                                    {/* Display available details in a prioritized order */}
                                    <div className="text-xs text-gray-500 mt-1">
                                        {[
                                            lead.headline && <span key="headline" className="block text-gray-600">{lead.headline}</span>,
                                            (lead.jobTitle || lead.company) &&
                                            <span key="position" className="block">
                                                {[lead.jobTitle, lead.company].filter(Boolean).join(" at ")}
                                            </span>,
                                            lead.location && <span key="location" className="block">{lead.location}</span>
                                        ].filter(Boolean)}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-1">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                                        <DropdownMenuItem>Remove</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Targets</span>
                        <span className="text-sm text-gray-600">{totalCount} / 250</span>
                    </div>
                    <Progress value={totalCount / 250 * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">100%</p>
                </div>
            </div>
        </div>;
    }

    // Default two-column layout
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload CSV */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Leads CSV</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                    Drag and drop your CSV file here, or click to browse
                </p>
                <div className="relative">
                    <Button variant="outline">Browse files</Button>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>Max size: 5MB | Required columns: Name, Email, LinkedIn URL</p>
                <button
                    onClick={handleDownloadSample}
                    className="text-primary hover:underline inline-flex items-center mt-2"
                >
                    <Download className="w-4 h-4 mr-1" />
                    Download Sample CSV
                </button>
            </div>
        </div>

        {/* Right Column: Existing Lists */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Use Previous Lead Lists</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a List
                    </label>
                    <Select value={selectedList} onValueChange={setSelectedList}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a list..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="product-hunt">Product Hunt Leads</SelectItem>
                            <SelectItem value="sales-demos">Sales Demos</SelectItem>
                            <SelectItem value="vc-outreach">VC Outreach</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selectedList && <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Preview (first 3 leads):</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium">John Doe</span>
                            <span className="text-sm text-gray-500">john@example.com</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium">Jane Smith</span>
                            <span className="text-sm text-gray-500">jane@example.com</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium">Mike Johnson</span>
                            <span className="text-sm text-gray-500">mike@example.com</span>
                        </div>
                    </div>
                </div>}

                <Button onClick={handleImportList} disabled={!selectedList} className="w-full mt-6">
                    Import List
                </Button>
            </div>
        </div>
    </div>;
};

export default ListOfLeads;
