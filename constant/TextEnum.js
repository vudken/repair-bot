const emoji = require('node-emoji');

const WHERE = Object.freeze({
	ATTIC: 'Чердак',
	STAIRCASE: 'Лестница (подъезд)',
	FLAT: 'Квартира',
	BASEMENT: 'Подвал',
	HEATING_STATION: 'Теплоузел',
});

const PROBLEM_WITH = Object.freeze({
	HOT_WATER: 'Горячая вода',
	HEATING: 'Отопление',
});

const CAUSE = Object.freeze({
	PIPELINE: 'Лежак',
	TANK: 'Бундуль',
	VENTIL: 'Вентиль',
	VALVE: 'Клапан',
	RISER: 'Стояк',
	RADIATOR: 'Радиатор',
	FILTER: 'Фильтр',
	TOWEL_RAIL: 'Полотенцесушитель',
	COUNTER: 'Счётчик',
	EXPANSION_TANK: 'Расширительный бак',
});

const KEYBOARD = Object.freeze({
	CHOOSE_OPTION: '<b>Выберите один из вариантов:</b>',
	CHOOSE_EMPLOYEE: '<b>Чтобы назначить материал, выберите сотрудника:</b>',
	CHOOSE_ADDRESS: '<b>Выберите адрес работы:</b>',
	CHOOSE_EQUIMPMENT: '<b>Выберите материал:</b>',
	CHOOSE_CATEGORY: '<b>Выберите категорию:</b>',
	CHOOSE_MODEL_AND_QUANTITE: '<b>Выберите модель и кол-во:</b>',
	CHOOSE_WHERE: '<b>Выберите где была произведена работа:</b>',
	CHOOSE_PROBLEM_WITH: '<b>Выберите в чём проблема:</b>',
	CHOOSE_CAUSE: '<b>Выберите с чем произведена работа:</b>',
	ATTACH_PHOTO: '<b>Прикрепите фото, нажав на скрепку:</b>',
	WORK_DECRIPTION: '<b>Описание работы</b>',
});

const EQUIMPMENT = Object.freeze({
	CONTROLLER: 'Контроллер',
	COUNTER: 'Счётчик',
	PUMP: 'Насос',
	REGULATOR: 'Регулятор',
	SENSOR: 'Датчик',
});

const BOT = Object.freeze({
	START: 'Bot has been started',
	STOP: 'Bot has been stopped',
	RELAUNCH: 'Bot has been relaunched',
});

const BTN = Object.freeze({
	BACK_BTN: `Назад ${emoji.get('arrow_left')}`,
	CONTINUE: `Продолжить ${emoji.get('arrow_right')}`,
	UNDERSTAND: `Я понял ${emoji.get('x')}`,
	COMPLETE: 'Завершить',
	COMPLETE_WORK: `Завершить работу ${emoji.get('arrow_right')}`,
	SEND: `Отправить ${emoji.get('arrow_up')}`,
	WRITE_ON_WORKER: 'Записать материал на работника',
	GET_DESCRIPTION: `Получить описание работы ${emoji.get('arrow_down')}`,
	ADD_ANOTHER_PLACE: 'Добавить ещё место',
});

const INFO = Object.freeze({
	MATERIAL_RECORDED: 'Материал успешно записан на сотрудника и добавлен в базу данных',
	NOTHING_ADDED: 'Вы ничего не добавили в сборку материала',
	COMPLETE_MSG_ALERT: 'Спасибо за успешно выполненную работу! Все фото сохранены и отправлены на имейл в сметочную',
	PHOTO_WARNING: `Отправляйте фото, когда выберете адрес, пройдёте все шаги завершения работы и увидите сообщение с текстом <b>"Прикрепите фото, нажав на скрепку"</b>!`,
});

const OTHER = Object.freeze({
	INCREMENT: 'increment',
	DICREMENT: 'dicrement',
	INFO: 'info',
	UNDEFINED: 'Given object is undefined.',
	ERROR: 'Произошла ошибка, попробуйте заново или свяжитесь с администрацией'
});

module.exports = {
	WHERE,
	PROBLEM_WITH,
	CAUSE,
	KEYBOARD,
	EQUIMPMENT,
	BOT,
	BTN,
	INFO,
	OTHER,
};