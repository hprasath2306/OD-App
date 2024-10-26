import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icons

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [highlightedDays, setHighlightedDays] = useState(['2024-10-03', '2024-10-04', '2024-10-20']);
  const today = moment().startOf('day'); // Get today's date

  const generateDays = () => {
    const startOfMonth = currentDate.clone().startOf('month');
    const endOfMonth = currentDate.clone().endOf('month');
    const days = [];
    let day = startOfMonth.clone().startOf('week');
    while (day.isBefore(endOfMonth, 'week')) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day.clone());
        day.add(1, 'day');
      }
      days.push(week);
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  const isHighlighted = (day:any) => {
    return highlightedDays.includes(day.format('YYYY-MM-DD'));
  };

  const isToday = (day:any) => {
    return day.isSame(today, 'day');
  };

  const days = generateDays();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navButton}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{currentDate.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {days.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((day, dayIndex) => {
            const isCurrentMonth = day.month() === currentDate.month();
            return (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.day,
                  isCurrentMonth ? styles.currentMonthDay : styles.otherMonthDay,
                  isHighlighted(day) ? styles.highlightedDay : null,
                  isToday(day) ? styles.today : null,
                ]}
              >
                <Text style={[styles.dayText, isCurrentMonth ? styles.currentMonthDayText : styles.otherMonthDayText]}>
                  {day.date()}
                </Text>

                {/* Add pin icon for today's date */}
                {isToday(day) && (
                  <MaterialIcons
                    name="push-pin"
                    size={14}
                    color="white"
                    style={styles.pinIcon}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    fontSize: 20,
    color: '#fff',
  },
  monthYear: {
    fontSize: 20,
    color: '#fff',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    color: '#999',
  },
  day: {
    width: 40,
    height: 60, // Increase height for the pin icon
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,
    position: 'relative',
  },
  currentMonthDay: {
    backgroundColor: '#333',
  },
  otherMonthDay: {
    backgroundColor: '#222',
  },
  highlightedDay: {
    backgroundColor: '#ffa500',
  },
  today: {
    backgroundColor: '#87CEFA', // Light blue color for today's date
  },
  dayText: {
    fontSize: 16,
  },
  currentMonthDayText: {
    color: '#fff',
  },
  otherMonthDayText: {
    color: '#555',
  },
  pinIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});

export default CalendarComponent;
