import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export function EmitEvent(eventName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const eventEmitter: EventEmitter2 = this.eventEmitter;
      if (!eventEmitter) {
        throw new Error(
          `EventEmitter2 instance not found in class ${target.constructor.name}. Ensure it's injected.`
        );
      }

      try {
        const result = await originalMethod.apply(this, args);
        eventEmitter.emit(eventName, result); // Emit event with result data
        return result;
      } catch (error) {
        throw new error(); // Propagate errors normally
      }
    };

    return descriptor;
  };
}
