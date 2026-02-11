import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, X, User, Mail, Phone, MapPin } from 'lucide-react';
import Layout from '../components/Layout';
import { customerAPI } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      setNotification({ show: true, message: 'Error fetching customers', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditMode(false);
    setCurrentCustomer(null);
  };

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (customer) => {
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await customerAPI.update(currentCustomer._id, formData);
        showNotification('Customer updated successfully', 'success');
      } else {
        await customerAPI.create(formData);
        showNotification('Customer added successfully', 'success');
      }
      
      fetchCustomers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        showNotification('Customer deleted successfully', 'success');
        fetchCustomers();
      } catch (error) {
        showNotification('Error deleting customer', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Notification Toast */}
        {notification.show && (
          <div className={`toast ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg`}>
            {notification.message}
          </div>
        )}

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Customers</h1>
            <p className="text-gray-600">Manage your customer database</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Customers Grid */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first customer</p>
            <button
              onClick={handleAddClick}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
            >
              Add Customer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-xl shadow-md p-6 card-shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3">{customer.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editMode ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700"
                  >
                    {editMode ? 'Update' : 'Add'} Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Customers;