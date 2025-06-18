"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, Search, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import React from "react";

export function DocumentFilters() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or participant..." className="pl-8" />
        </div>
        
        <Select>
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-yellow-500" />Pending</div>
            </SelectItem>
            <SelectItem value="signed">
              <div className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" />Signed</div>
            </SelectItem>
            <SelectItem value="completed">
             <div className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-primary" />Completed</div>
            </SelectItem>
             <SelectItem value="rejected">
             <div className="flex items-center"><AlertCircle className="mr-2 h-4 w-4 text-red-500" />Rejected</div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {date ? format(date, "PPP") : <span>Filter by Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select>
          <SelectTrigger>
            <div className="flex items-center">
               <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by Participant" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user1">Alice Wonderland</SelectItem>
            <SelectItem value="user2">Bob The Builder</SelectItem>
            <SelectItem value="user3">Charlie Brown</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
