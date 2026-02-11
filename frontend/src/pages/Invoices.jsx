import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, X, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import { invoiceAPI, customerAPI, productAPI } from '../services/api';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([{ productId: '', quantity: 1 }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Filter invoices based on search term
    if (searchTerm) {
      const filtered = invoices.filter(invoice =>
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchTerm, invoices]);

  const fetchData = useCallback(async () => {
    try {
      const [invoicesRes, customersRes, productsRes] = await Promise.all([
        invoiceAPI.getAll(),
        customerAPI.getAll(),
        productAPI.getAll()
      ]);
      
      setInvoices(invoicesRes.data);
      setFilteredInvoices(invoicesRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      setNotification({ show: true, message: 'Error fetching data', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddClick = () => {
    setSelectedCustomer('');
    setInvoiceItems([{ productId: '', quantity: 1 }]);
    setNotes('');
    setShowModal(true);
  };

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems.length > 0 ? newItems : [{ productId: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    setInvoiceItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    
    invoiceItems.forEach(item => {
      if (item.productId && item.quantity) {
        const product = products.find(p => p._id === item.productId);
        if (product) {
          subtotal += product.price * item.quantity;
        }
      }
    });

    const taxRate = 5;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      showNotification('Please select a customer', 'error');
      return;
    }

    const validItems = invoiceItems.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      showNotification('Please add at least one product', 'error');
      return;
    }

    try {
      await invoiceAPI.create({
        customerId: selectedCustomer,
        items: validItems,
        notes
      });
      
      showNotification('Invoice created successfully', 'success');
      fetchData();
      setShowModal(false);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create invoice', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceAPI.delete(id);
        showNotification('Invoice deleted successfully', 'success');
        fetchData();
      } catch (error) {
        showNotification('Error deleting invoice', 'error');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await invoiceAPI.update(id, { status: newStatus });
      showNotification('Invoice status updated', 'success');
      fetchData();
    } catch (error) {
      showNotification('Error updating status', 'error');
    }
  };

  const totals = calculateTotals();

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoices</h1>
            <p className="text-gray-600">Manage and track your invoices</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name or invoice number..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Invoices Table */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No invoices found' : 'No invoices yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try a different search term' : 'Get started by creating your first invoice'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddClick}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
              >
                Create Invoice
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Invoice #</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Subtotal</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tax (5%)</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-sm font-medium text-primary-600">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {invoice.customerName}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        ${invoice.subtotal.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        ${invoice.taxAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                        ${invoice.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-none cursor-pointer ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Invoice Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fadeIn">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Create New Invoice</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Customer *
                  </label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">-- Choose a customer --</option>
                    {customers.map(customer => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} ({customer.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Products *
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {invoiceItems.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">-- Select Product --</option>
                          {products.map(product => (
                            <option key={product._id} value={product._id}>
                              {product.name} - ${product.price.toFixed(2)} (Stock: {product.stock})
                            </option>
                          ))}
                        </select>
                        
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                          required
                          placeholder="Qty"
                          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />

                        {invoiceItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-800">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span className="font-medium text-gray-800">${totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-primary-600">${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add any additional notes..."
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-medium shadow-lg"
                  >
                    Create Invoice
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

export default Invoices;