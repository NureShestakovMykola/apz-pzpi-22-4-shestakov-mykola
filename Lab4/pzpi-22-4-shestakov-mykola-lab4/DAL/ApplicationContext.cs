using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Advice> Advices { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceLog> DeviceLogs { get; set; }
        public DbSet<ManualWateringRequest> ManualWateringRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<WateringLog> WateringLogs { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<Device>()
                .HasOne(d => d.User)
                .WithMany(u => u.Devices)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Device>()
                .HasOne(d => d.Schedule)
                .WithMany(s => s.Devices)
                .HasForeignKey(d => d.ScheduleId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<DeviceLog>()
                .HasOne(l => l.Device)
                .WithMany(d => d.DeviceLogs)
                .HasForeignKey(d => d.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Notification>()
                .HasOne(n => n.Device)
                .WithMany(d => d.Notifications)
                .HasForeignKey(n => n.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Notification>()
                .HasOne(n => n.Advice)
                .WithMany()
                .HasForeignKey(n => n.AdviceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Schedule>()
                .HasOne(d => d.User)
                .WithMany(u => u.Schedules)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<WateringLog>()
                .HasOne(w => w.Device)
                .WithMany(d => d.WateringLogs)
                .HasForeignKey(w => w.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ManualWateringRequest>()
                .HasOne(w => w.Device)
                .WithMany(d => d.ManualWateringRequests)
                .HasForeignKey(w => w.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
