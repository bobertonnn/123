
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, Search, Users, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { format } from "date-fns";
import React from "react";

interface DocumentFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedStatus?: string;
  onStatusChange: (status?: string) => void;
  selectedDate?: Date;
  onDateChange: (date?: Date) => void;
  selectedParticipant?: string;
  onParticipantChange: (participant?: string) => void;
  allParticipants: string[];
}

export function DocumentFilters({
  searchTerm,
  onSearchTermChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
  selectedParticipant,
  onParticipantChange,
  allParticipants,
}: DocumentFiltersProps) {

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popover from closing if it's open
    onDateChange(undefined);
  };

  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, summary, participant..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        
        <Select value={selectedStatus || "all"} onValueChange={(value) => onStatusChange(value === "all" ? undefined : value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">
              <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-yellow-500" />Pending</div>
            </SelectItem>
            <SelectItem value="Uploaded">
              <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-blue-500" />Uploaded</div>
            </SelectItem>
            <SelectItem value="Signed">
              <div className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" />Signed</div>
            </SelectItem>
            <SelectItem value="Completed">
             <div className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-primary" />Completed</div>
            </SelectItem>
             <SelectItem value="Rejected">
             <div className="flex items-center"><AlertCircle className="mr-2 h-4 w-4 text-red-500" />Rejected</div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal relative"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Filter by Date</span>}
              {selectedDate && (
                <X
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-destructive"
                  onClick={handleClearDate}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={selectedParticipant || "all"} onValueChange={(value) => onParticipantChange(value === "all" ? undefined : value)}>
          <SelectTrigger>
            <div className="flex items-center">
               <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by Participant" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Participants</SelectItem>
            {allParticipants.map(participant => (
              <SelectItem key={participant} value={participant}>{participant}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
