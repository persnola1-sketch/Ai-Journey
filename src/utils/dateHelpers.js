import { format, formatDistanceToNow, isToday, isYesterday, isPast } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  try {
    const date = new Date(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatRelativeDate = (dateString) => {
  try {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Today';
    }
    
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy - h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
};

export const isOverdue = (dateString) => {
  try {
    const date = new Date(dateString);
    return isPast(date) && !isToday(date);
  } catch (error) {
    return false;
  }
};

export const getDaysUntil = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return null;
  }
};

