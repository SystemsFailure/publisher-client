export default class DateService {
    options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    form (date) {
        return new Date(date).toLocaleDateString('ru-RU', this.options)
    }
} 