
import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users, Calendar, Settings, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import AdminLogin from '@/components/AdminLogin';
import AddCompanionForm from '@/components/AddCompanionForm';
import EditCompanionForm from '@/components/EditCompanionForm';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useCompanions, type Companion } from '@/hooks/useCompanions';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminDashboard = () => {
  const { isAdminLoggedIn, adminEmail, logoutAdmin } = useAdminAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(null);
  
  const { companions, loading, addCompanion, updateCompanion, deleteCompanion } = useCompanions();

  // If not logged in as admin, show login form
  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  const stats = [
    { title: 'Total Companions', value: companions.length, icon: Users, color: 'text-medical-primary' },
    { title: 'Active Companions', value: companions.filter(c => c.status === 'Active').length, icon: Heart, color: 'text-medical-mint-600' },
    { title: 'Inactive Companions', value: companions.filter(c => c.status === 'Inactive').length, icon: Calendar, color: 'text-medical-blue-600' },
    { title: 'Total Reviews', value: companions.reduce((sum, c) => sum + c.reviews, 0), icon: Settings, color: 'text-trust-blue-600' }
  ];

  const handleAddCompanion = async (newCompanion: any) => {
    try {
      await addCompanion(newCompanion);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add companion:', error);
    }
  };

  const handleEditCompanion = async (updates: Partial<Companion>) => {
    if (!editingCompanion) return;
    
    try {
      await updateCompanion(editingCompanion.id, updates);
      setEditingCompanion(null);
    } catch (error) {
      console.error('Failed to update companion:', error);
    }
  };

  const handleDeleteCompanion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this companion?')) {
      try {
        await deleteCompanion(id);
      } catch (error) {
        console.error('Failed to delete companion:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 via-white to-medical-mint-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Admin Info and Logout */}
        <div className="mb-8 flex justify-between items-start">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-medical-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-medical-primary animate-heart-beat" />
              <h1 className="text-3xl font-bold text-medical-blue-800">SaathiCare Admin</h1>
            </div>
            <p className="text-medical-blue-600">Healthcare companion management dashboard</p>
            <p className="text-sm text-medical-primary mt-2 font-medium">Logged in as: {adminEmail}</p>
          </div>
          <Button 
            onClick={logoutAdmin}
            variant="outline"
            className="flex items-center gap-2 border-medical-blue-200 text-medical-blue-700 hover:bg-medical-blue-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border border-medical-blue-100 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-medical-blue-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-medical-blue-800">{stat.value}</p>
                  </div>
                  <div className="bg-gradient-to-br from-medical-blue-50 to-medical-mint-50 p-3 rounded-full">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Companions Management */}
        <Card className="bg-white rounded-2xl shadow-sm border border-medical-blue-100">
          <CardHeader className="bg-gradient-to-r from-medical-blue-50 to-medical-mint-50 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-medical-blue-800">Healthcare Companion Management</CardTitle>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-medical-primary hover:bg-medical-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Companion
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-medical-blue-600">Loading companions...</div>
              </div>
            ) : companions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-medical-blue-600">No companions found. Add your first companion!</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-medical-blue-100">
                      <TableHead className="text-medical-blue-700 font-semibold">Name</TableHead>
                      <TableHead className="text-medical-blue-700 font-semibold">Location</TableHead>
                      <TableHead className="text-medical-blue-700 font-semibold">Experience</TableHead>
                      <TableHead className="text-medical-blue-700 font-semibold">Specialties</TableHead>
                      <TableHead className="text-medical-blue-700 font-semibold">Status</TableHead>
                      <TableHead className="text-medical-blue-700 font-semibold">Join Date</TableHead>
                      <TableHead className="text-medical-blue-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companions.map((companion) => (
                      <TableRow key={companion.id} className="border-medical-blue-50 hover:bg-medical-blue-25">
                        <TableCell className="font-medium text-medical-blue-800">{companion.name}</TableCell>
                        <TableCell className="text-medical-blue-600">{companion.location}</TableCell>
                        <TableCell className="text-medical-blue-600">{companion.experience}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {companion.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} className="bg-medical-mint-100 text-medical-mint-700 border border-medical-mint-200 text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {companion.specialties.length > 2 && (
                              <Badge className="bg-medical-blue-100 text-medical-blue-700 border border-medical-blue-200 text-xs">
                                +{companion.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={companion.status === 'Active' 
                              ? 'bg-medical-mint-100 text-medical-mint-800 border border-medical-mint-200' 
                              : 'bg-gray-100 text-gray-600'
                            }
                          >
                            {companion.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-medical-blue-600">
                          {new Date(companion.join_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingCompanion(companion)}
                              className="border-medical-blue-200 text-medical-blue-600 hover:bg-medical-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCompanion(companion.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Companion Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-medical-blue-100 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-medical-primary" />
                    <h3 className="text-xl font-semibold text-medical-blue-800">Add New Healthcare Companion</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="text-medical-blue-600 hover:bg-medical-blue-50"
                  >
                    ×
                  </Button>
                </div>
                <AddCompanionForm 
                  onSubmit={handleAddCompanion}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Companion Form Modal */}
        {editingCompanion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-medical-blue-100 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-medical-primary" />
                    <h3 className="text-xl font-semibold text-medical-blue-800">Edit Healthcare Companion</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingCompanion(null)}
                    className="text-medical-blue-600 hover:bg-medical-blue-50"
                  >
                    ×
                  </Button>
                </div>
                <EditCompanionForm 
                  companion={editingCompanion}
                  onSubmit={handleEditCompanion}
                  onCancel={() => setEditingCompanion(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
